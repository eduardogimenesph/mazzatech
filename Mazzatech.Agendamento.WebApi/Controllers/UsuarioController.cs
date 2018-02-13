using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using Mazzatech.Agendamento.WebApi.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mazzatech.Agendamento.WebApi.Controllers
{
    [Produces("application/json")]
    [Route("api/Usuario")]
    public class UsuarioController : BaseController<Usuario>
    {
        private IUsuarioService _service;
        private readonly TokenAuthOptions tokenOptions;


        public UsuarioController(IUsuarioService service, TokenAuthOptions tokenOptions)
            : base(service)
        {
            _service = service;
            this.tokenOptions = tokenOptions;
        }

        public override Task<MensagemRetorno<Usuario>> Put(int id, [FromBody] Usuario entity)
        {
            var usuario = _service.FindByConditionFirst(x => x.Id == id).Result;
            if (entity.Status == Status.Ativo && !String.IsNullOrEmpty(entity.Senha))
            {
                usuario.Senha = Md5Helper.MD5Hash(entity.Senha);
            }
            usuario.Login = entity.Login;
            usuario.Nome = entity.Nome;
            usuario.Status = entity.Status;
            return base.Put(id, usuario);
        }

        public override Task<MensagemRetorno<Usuario>> Post([FromBody] Usuario entity)
        {
            entity.Senha = Md5Helper.MD5Hash(entity.Senha);
            return base.Post(entity);
        }

        [HttpGet("GetTokenVerify")]
        [Authorize("Bearer")]
        public dynamic GetTokenVerify()
        {
            bool authenticated = false;
            string user = null;
            int entityId = -1;
            string token = null;
            DateTime? tokenExpires = default(DateTime?);

            var currentUser = HttpContext.User;
            if (currentUser != null)
            {
                authenticated = currentUser.Identity.IsAuthenticated;
                if (authenticated)
                {
                    user = currentUser.Identity.Name;
                    foreach (Claim c in currentUser.Claims) if (c.Type == "EntityID") entityId = Convert.ToInt32(c.Value);
                    tokenExpires = DateTime.UtcNow.AddMinutes(2);
                    token = GetToken(currentUser.Identity.Name, tokenExpires);
                }
            }
            return new { authenticated = authenticated, user = user, entityId = entityId, token = token, tokenExpires = tokenExpires };
        }

        public class AuthRequest
        {
            public string Usuario { get; set; }
            public string Senha { get; set; }
        }

        /// <summary>
        /// Request a new token for a given username/password pair.
        /// </summary>
        /// <param name="req"></param>
        /// <returns></returns>
        [HttpPost("Login")]
        public dynamic Login([FromBody] AuthRequest req)
        {
            req.Senha = Md5Helper.MD5Hash(req.Senha);
            var usuario = _service.FindByCondition(x => x.Status == Status.Ativo && x.Login == req.Usuario.ToLower() && x.Senha == req.Senha);
            if (usuario.Result.Dados.Count() > 0)
            {
                DateTime? expires = DateTime.UtcNow.AddMinutes(120);
                var token = GetToken(usuario.Result.Dados.FirstOrDefault().Nome, expires);
                return new { authenticated = true, entityId = 1, token = token, tokenExpires = expires };
            }
            return new { authenticated = false };
        }

        private string GetToken(string user, DateTime? expires)
        {
            var handler = new JwtSecurityTokenHandler();


            ClaimsIdentity identity = new ClaimsIdentity(new GenericIdentity(user, "TokenAuth"), new[] { new Claim("EntityID", "1", ClaimValueTypes.Integer) });

            var securityToken = handler.CreateToken(new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor()
            {
                Issuer = tokenOptions.Issuer,
                Audience = tokenOptions.Audience,
                SigningCredentials = tokenOptions.SigningCredentials,
                Subject = identity,
                Expires = expires
            });
            return handler.WriteToken(securityToken);
        }
    }
}