using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mazzatech.Agendamento.Domain
{
    public class Paciente : Base
    {
        [MaxLength(300)]
        public string Nome { get; set; }

        [MaxLength(16)]
        public string Telefone { get; set; }

        [MaxLength(16)]
        public string Celular { get; set; }

        [MaxLength(14)]
        public string CPF { get; set; }

        [MaxLength(150)]
        public string Email { get; set; }

        public DateTime DataNascimento { get; set; }

        [MaxLength(300)]
        public string EnderecoCompleto { get; set; }

        public virtual IList<AgendamentoMedico> Agendamentos { get; set; }
    }
}
