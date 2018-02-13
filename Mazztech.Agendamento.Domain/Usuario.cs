using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Mazzatech.Agendamento.Domain
{
    public class Usuario : Base
    {
        [MaxLength(300)]
        public string Nome { get; set; }
        [MaxLength(50)]
        public string Login { get; set; }
        [MaxLength(150)]
        public string Senha { get; set; }
    }
}
