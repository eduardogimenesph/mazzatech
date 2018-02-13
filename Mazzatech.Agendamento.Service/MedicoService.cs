using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Repositories;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Mazzatech.Agendamento.Service
{
    public class MedicoService : BaseService<Medico>, IMedicoService
    {
        private IBaseRepository<Medico> _repository;

        public MedicoService(IBaseRepository<Medico> repository)
            : base(repository)
        {
            _repository = repository;
        }
        public override Task<MensagemRetorno<Medico>> Save(Medico entity)
        {
            this.BeforeSave(entity);
            return base.Save(entity);
        }


        public override Task<MensagemRetorno<Medico>> Update(Medico entity)
        {
            this.BeforeUpdate(entity);
            return base.Update(entity);
        }
        public override MensagemRetorno<Medico> BeforeSave(Medico entity)
        {
            var contagem = _repository.FindByCondition(x => x.Status == Status.Ativo && x.CRM.ToLower() == entity.CRM.ToLower());
            if(contagem.Count > 0)
            {
                return new MensagemRetorno<Medico> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "CRM já cadastrado!" } };
            }
            return null;
        }

        public override MensagemRetorno<Medico> BeforeUpdate(Medico entity)
        {
            if (entity.Status == Status.Ativo)
            {
                var contagem = _repository.FindByCondition(x => x.Id != entity.Id && x.Status == Status.Ativo && x.CRM.ToLower() == entity.CRM.ToLower()) as List<Medico>;
                if (contagem.Count > 0)
                {
                    return new MensagemRetorno<Medico> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "CRM já cadastrado!" } };
                }
            }
            return null;
        }
    }
}
