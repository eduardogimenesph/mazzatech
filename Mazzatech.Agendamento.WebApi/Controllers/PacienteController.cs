using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mazzatech.Agendamento.WebApi.Controllers
{
    [Produces("application/json")]
    [Route("api/Paciente")]
    public class PacienteController : BaseController<Paciente>
    {
        private IPacienteService _service;

        public PacienteController(IPacienteService service)
            : base(service)
        {
            _service = service;
        }
    }
}