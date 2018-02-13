using System;
using System.Collections.Generic;
using System.Text;

namespace Mazzatech.Agendamento.Domain
{
    public enum Status
    {
        Inativo = 0,
        Ativo = 1
    }
    public abstract class Base
    {
        public Base()
        {
            this.DataCriado = DateTime.Now;
        }
        public long Id { get; set; }
        public DateTime DataCriado { get; set; }
        public DateTime? DataModificado { get; set; }
        public long? UsuarioCriadoId { get; set; }
        public long? UsuarioModificadoId { get; set; }
        public Status Status { get; set; }
    }
}
