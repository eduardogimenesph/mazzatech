using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Mazzatech.Agendamento.Domain
{
    public class AgendamentoMedico : Base
    {
        [ForeignKey("Medico")]
        public long MedicoId { get; set; }

        [ForeignKey("Paciente")]
        public long PacienteId { get; set; }

        public DateTime DataConsulta { get; set; }

        [MaxLength(400)]
        public string Diagnostico { get; set; }

        public virtual Medico Medico { get; set; }
        public virtual Paciente Paciente { get; set; }

        [NotMapped]
        public string DataFormatada { get; set; }
    }
}
