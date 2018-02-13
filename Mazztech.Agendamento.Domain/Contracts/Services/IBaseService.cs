using Mazzatech.Agendamento.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Mazzatech.Agendamento.Domain.Contracts.Services
{
    public interface IBaseService<T>
    {
        Task<MensagemRetorno<T>> FindAll();
        Task<MensagemRetorno<T>> FindByCondition(Expression<Func<T, bool>> expression);
        void Create(T entity);
        Task<MensagemRetorno<T>> Update(T entity);
        Task<MensagemRetorno<T>> Delete(T entity);
        Task<MensagemRetorno<T>> Save(T entity);
        Task<T> FindByConditionFirst(Expression<Func<T, bool>> expression);
    }
}
