using System;
using System.Collections.Generic;
using System.Text;

namespace Mazzatech.Agendamento.Domain.Common
{
    public enum StatusRetorno
    {
        Erro = 0,
        Sucesso = 1,
        Alerta = 2
    }
    public class MensagemRetorno<T>
    {
        public StatusRetorno StatusRetorno { get; set; }
        public List<string> Mensagem { get; set; }
        public IEnumerable<T> Dados { get; set; }
    }
}
