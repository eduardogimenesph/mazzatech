using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Repositories;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mazzatech.Agendamento.Service
{
    public class PacienteService : BaseService<Paciente>, IPacienteService
    {
        private IBaseRepository<Paciente> _repository;

        public PacienteService(IBaseRepository<Paciente> repository)
            : base(repository)
        {
            _repository = repository;
        }

        public override MensagemRetorno<Paciente> BeforeSave(Paciente entity)
        {
            var contagem = _repository.FindByCondition(x => x.Status == Status.Ativo && x.CPF.ToLower() == entity.CPF.ToLower());
            if (contagem.Count > 0)
            {
                return new MensagemRetorno<Paciente> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "Paciente já cadastrado!" } };
            }
            return null;
        }

        public override MensagemRetorno<Paciente> BeforeUpdate(Paciente entity)
        {
            if (entity.Status == Status.Ativo)
            {
                var contagem = _repository.FindByCondition(x => x.Id != entity.Id && x.Status == Status.Ativo && x.CPF.ToLower() == entity.CPF.ToLower());
                if (contagem.Count > 0)
                {
                    return new MensagemRetorno<Paciente> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "Paciente já cadastrado!" } };
                }
            }
            return null;
        }
    }
}
