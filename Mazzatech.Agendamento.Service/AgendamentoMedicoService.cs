using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Repositories;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Mazzatech.Agendamento.Service
{
    public class AgendamentoMedicoService : BaseService<AgendamentoMedico>, IAgendamentoMedicoService
    {
        private IBaseRepository<AgendamentoMedico> _repository;
        private IBaseRepository<Paciente> _pacienteRepository;
        private IBaseRepository<Medico> _medicoRepository;

        public AgendamentoMedicoService(IBaseRepository<AgendamentoMedico> repository,
                                            IBaseRepository<Paciente> pacienteRepository,
                                          IBaseRepository<Medico> medicoRepository  )
            : base(repository)
        {
            _repository = repository;
            _pacienteRepository = pacienteRepository;
            _medicoRepository = medicoRepository;
        }

        public override Task<MensagemRetorno<AgendamentoMedico>> FindByCondition(Expression<Func<AgendamentoMedico, bool>> expression)
        {
            var retorno = new MensagemRetorno<AgendamentoMedico> { StatusRetorno = StatusRetorno.Sucesso, Mensagem = new List<string>() { "" } };
            try
            {
                var dados = _repository.FindByCondition(expression); 

                foreach(var item in dados)
                {
                    item.Paciente = _pacienteRepository.FindByConditionFirst(x => x.Id == item.PacienteId);
                    item.Medico = _medicoRepository.FindByConditionFirst(x => x.Id == item.MedicoId);
                    item.DataFormatada = item.DataConsulta.ToString("dd/MM/yyyy HH:mm");
                }
                retorno.Dados = dados;
            }
            catch (Exception ex)
            {
                retorno.StatusRetorno = StatusRetorno.Erro;
                retorno.Mensagem = new List<string> { ex.Message };
            }

            return Task.FromResult(retorno);
        }

        public override MensagemRetorno<AgendamentoMedico> BeforeSave(AgendamentoMedico entity)
        {
            var contagem = _repository.FindByCondition(x => x.Status == Status.Ativo && x.MedicoId  == entity.MedicoId && x.PacienteId == entity.PacienteId && x.DataConsulta == entity.DataConsulta);
            if (contagem.Count > 0)
            {
                return new MensagemRetorno<AgendamentoMedico> { StatusRetorno = StatusRetorno.Alerta, Mensagem = new List<string> { "Agendamento já cadastrado!" } };
            }

            entity.DataConsulta = entity.DataConsulta.AddHours(-2);
            return null;
        }
    }
}
