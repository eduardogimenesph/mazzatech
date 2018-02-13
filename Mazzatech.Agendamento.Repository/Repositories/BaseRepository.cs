using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Contracts.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Mazzatech.Agendamento.Repository.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected BancoContexto BancoContexto { get; set; }

        public BaseRepository()
        {
            this.BancoContexto = new BancoContexto();
        }

        public virtual void Create(T entity)
        {
            this.BancoContexto.Set<T>().Add(entity);
        }

        public virtual void Delete(T entity)
        {
            this.BancoContexto.Set<T>().Remove(entity);
        }

        public virtual IEnumerable<T> FindAll()
        {
            return this.BancoContexto.Set<T>();
        }

        public virtual IList<T> FindByCondition(Expression<Func<T, bool>> expression)
        {
            return this.BancoContexto.Set<T>().Where(expression).ToList();
        }

        public virtual T FindByConditionFirst(Expression<Func<T, bool>> expression)
        {
            return this.BancoContexto.Set<T>().Where(expression).FirstOrDefault();
        }

        public virtual void Save()
        {
            this.BancoContexto.SaveChanges();
        }

        public virtual void Update(T entity)
        {
            this.BancoContexto.Set<T>().Update(entity);
        }
    }
}
