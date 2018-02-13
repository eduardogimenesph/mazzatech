using Mazzatech.Agendamento.Domain;
using Mazzatech.Agendamento.Domain.Common;
using Mazzatech.Agendamento.Domain.Contracts.Repositories;
using Mazzatech.Agendamento.Domain.Contracts.Services;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Mazzatech.Agendamento.Service
{
    public class BaseService<T> : IBaseService<T> where T : Base
    {
        private IBaseRepository<T> _repository;

        public BaseService(IBaseRepository<T> repository)
        {
            _repository = repository;
        }


        public virtual void Create(T entity)
        {
            _repository.Create(entity);
        }

        public virtual Task<MensagemRetorno<T>> Delete(T entity)
        {
            var retorno = new MensagemRetorno<T> { StatusRetorno = StatusRetorno.Sucesso, Mensagem = new List<string>() { "Registro deletado com sucesso!" } };
            try
            {
                _repository.Delete(entity);
            }
            catch (Exception ex)
            {
                retorno.StatusRetorno = StatusRetorno.Erro;
                retorno.Mensagem = new List<string> { ex.Message };
            }

            return Task.FromResult(retorno);
        }

        public virtual MensagemRetorno<T> BeforeSave(T entity)
        {
            return null;
        }

        public virtual MensagemRetorno<T> BeforeUpdate(T entity)
        {
            return null;
        }

        public virtual Task<MensagemRetorno<T>> FindAll()
        {
            var retorno = new MensagemRetorno<T> { StatusRetorno = StatusRetorno.Sucesso, Mensagem = new List<string>() { "" } };
            try
            {
                retorno.Dados = _repository.FindAll();
            }
            catch (Exception ex)
            {
                retorno.StatusRetorno = StatusRetorno.Erro;
                retorno.Mensagem = new List<string> { ex.Message };
            }

            return Task.FromResult(retorno);
        }

        public virtual Task<T> FindByConditionFirst(Expression<Func<T, bool>> expression)
        {

            return Task.FromResult(_repository.FindByConditionFirst(expression));
        }

        public virtual Task<MensagemRetorno<T>> FindByCondition(Expression<Func<T, bool>> expression)
        {
            var retorno = new MensagemRetorno<T> { StatusRetorno = StatusRetorno.Sucesso, Mensagem = new List<string>() { "" } };
            try
            {
                retorno.Dados = _repository.FindByCondition(expression);
            }
            catch (Exception ex)
            {
                retorno.StatusRetorno = StatusRetorno.Erro;
                retorno.Mensagem = new List<string> { ex.Message };
            }

            return Task.FromResult(retorno);
        }

        public virtual Task<MensagemRetorno<T>> Save(T entity)
        {
            var retorno = new MensagemRetorno<T> { StatusRetorno = StatusRetorno.Sucesso, Mensagem = new List<string>() { "Registro salvo com sucesso!" } };
            try
            {
                var beforeSave = BeforeSave(entity);

                if(beforeSave != null && beforeSave.Mensagem != null && beforeSave.Mensagem.Count > 0)
                {
                    return Task.FromResult(beforeSave);
                }
                    
                _repository.Create(entity);
                _repository.Save();
            }
            catch (Exception ex)
            {
                retorno.StatusRetorno = StatusRetorno.Erro;
                retorno.Mensagem = new List<string> { ex.Message };
            }

            return Task.FromResult(retorno);
        }

        public virtual Task<MensagemRetorno<T>> Update(T entity)
        {
            var retorno = new MensagemRetorno<T> { StatusRetorno = StatusRetorno.Sucesso, Mensagem = new List<string>() { "Registro atualizado com sucesso!" } };
            try
            {
                var beforeUpdate = BeforeUpdate(entity);

                if (beforeUpdate != null && beforeUpdate.Mensagem != null && beforeUpdate.Mensagem.Count > 0)
                {
                    return Task.FromResult(beforeUpdate);
                }


                _repository.Update(entity);
                _repository.Save();
            }
            catch (Exception ex)
            {
                retorno.StatusRetorno = StatusRetorno.Erro;
                retorno.Mensagem = new List<string> { ex.Message };
            }

            return Task.FromResult(retorno);
        }
    }

}
