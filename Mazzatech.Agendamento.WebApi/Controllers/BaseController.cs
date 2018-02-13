using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mazzatech.Agendamento.WebApi.Controllers
{
    [Produces("application/json")]
    [Route("api/Base")]
    public class BaseController<T> : Controller where T : Base
    {
        private IBaseService<T> _service;

        public BaseController(IBaseService<T> service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        [Authorize("Bearer")]
        public Task<MensagemRetorno<T>> Get(int id)
        {
            return _service.FindByCondition(x => x.Id == id);
        }

        [HttpGet]
        [Authorize("Bearer")]
        public Task<MensagemRetorno<T>> Get()
        {
            return _service.FindByCondition(x => x.Status == Status.Ativo);
        }


        [HttpPost]
        [Authorize("Bearer")]
        public virtual Task<MensagemRetorno<T>> Post([FromBody]T entity)
        {
            return _service.Save(entity);
        }
        

        [HttpPut("{id}")]
        [Authorize("Bearer")]
        public virtual Task<MensagemRetorno<T>> Put(int id, [FromBody]T entity)
        {
            return _service.Update(entity);
        }
        

        [HttpDelete("{id}")]
        [Authorize("Bearer")]
        public Task<MensagemRetorno<T>> Delete(int id)
        {
            var entity = _service.FindByCondition(x => x.Id == id).Result.Dados;
            if(entity.Count() > 0)
                return _service.Delete(entity.FirstOrDefault());

            return null;
        }
    }
}