using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mazzatech.Agendamento.Domain
{
    public class Medico : Base
    {
        [MaxLength(40)]
        public string CRM { get; set; }

        [MaxLength(300)]
        public string Nome { get; set; }

        [MaxLength(16)]
        public string Telefone { get; set; }

        [MaxLength(16)]
        public string Celular { get; set; }

        [MaxLength(300)]
        public string Especialidade { get; set; }

        public virtual IList<AgendamentoMedico> Agendamentos { get; set; }
    }
}
