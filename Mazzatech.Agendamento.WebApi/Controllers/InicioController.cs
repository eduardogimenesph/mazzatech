using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Mazzatech.Agendamento.WebApi.Controllers
{
    [Produces("application/json")]
    [Route("api/Inicio")]
    public class InicioController : Controller
    {

        public string Get()
        {
            return "Api Iniciada!";
        }
    }
}