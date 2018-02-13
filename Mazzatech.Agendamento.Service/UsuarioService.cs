using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Repositories;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mazzatech.Agendamento.Service
{
    public class UsuarioService : BaseService<Usuario>, IUsuarioService
    {
        private IBaseRepository<Usuario> _repository;

        public UsuarioService(IBaseRepository<Usuario> repository)
            : base(repository)
        {
            _repository = repository;
        }

        public override MensagemRetorno<Usuario> BeforeSave(Usuario entity)
        {
            var contagem = _repository.FindByCondition(x => x.Status == Status.Ativo && x.Login.ToLower() == entity.Login.ToLower());
            if (contagem.Count > 0)
            {
                return new MensagemRetorno<Usuario> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "Login já cadastrado!" } };
            }
            return null;
        }

        public override MensagemRetorno<Usuario> BeforeUpdate(Usuario entity)
        {
            if (entity.Status == Status.Ativo)
            {
                var contagem = _repository.FindByCondition(x => x.Id != entity.Id && x.Status == Status.Ativo && x.Login.ToLower() == entity.Login.ToLower());
                if (contagem.Count > 0)
                {
                    return new MensagemRetorno<Usuario> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "Login já cadastrado!" } };
                }
            }
            return null;
        }
    }
}
