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
    [Route("api/Medico")]
    public class MedicoController : BaseController<Medico>
    {
        private IMedicoService _service;

        public MedicoController(IMedicoService service)
            :base(service)
        {
            _service = service;
        }

        [AllowAnonymous]
        [HttpGet("GetAllMobile")]
        public Task<MensagemRetorno<Medico>> GetAllMobile()
        {
            return _service.FindByCondition(x => x.Status == Status.Ativo);
        }
    }
}