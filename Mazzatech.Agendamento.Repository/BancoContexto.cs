using Mazzatech.Agendamento.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Configuration;

namespace Mazzatech.Agendamento.Repository
{
    public class BancoContexto : DbContext
    {
        public DbSet<Paciente> Pacientes { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }

        public DbSet<Medico> Medicos{ get; set; }

        public DbSet<AgendamentoMedico> Agendamentos { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
          => optionsBuilder
              .UseMySql(@"Server=mysql873.umbler.com;database=mazzatechagendam;uid=mazzatechagen;pwd=m12345678;port=41890");
    }
}

