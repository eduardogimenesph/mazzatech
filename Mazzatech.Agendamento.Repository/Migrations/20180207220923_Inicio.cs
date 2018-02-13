using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Mazzatech.Agendamento.Repository.Migrations
{
    public partial class Inicio : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Medicos",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CRM = table.Column<string>(maxLength: 40, nullable: true),
                    Celular = table.Column<string>(maxLength: 16, nullable: true),
                    DataCriado = table.Column<DateTime>(nullable: false),
                    DataModificado = table.Column<DateTime>(nullable: true),
                    Especialidade = table.Column<string>(maxLength: 300, nullable: true),
                    Nome = table.Column<string>(maxLength: 300, nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Telefone = table.Column<string>(maxLength: 16, nullable: true),
                    UsuarioCriadoId = table.Column<long>(nullable: true),
                    UsuarioModificadoId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medicos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pacientes",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CPF = table.Column<string>(maxLength: 14, nullable: true),
                    Celular = table.Column<string>(maxLength: 16, nullable: true),
                    DataCriado = table.Column<DateTime>(nullable: false),
                    DataModificado = table.Column<DateTime>(nullable: true),
                    DataNascimento = table.Column<DateTime>(nullable: false),
                    Email = table.Column<string>(maxLength: 150, nullable: true),
                    EnderecoCompleto = table.Column<string>(maxLength: 300, nullable: true),
                    Nome = table.Column<string>(maxLength: 300, nullable: true),
                    Status = table.Column<int>(nullable: false),
                    Telefone = table.Column<string>(maxLength: 16, nullable: true),
                    UsuarioCriadoId = table.Column<long>(nullable: true),
                    UsuarioModificadoId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacientes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DataCriado = table.Column<DateTime>(nullable: false),
                    DataModificado = table.Column<DateTime>(nullable: true),
                    Login = table.Column<string>(maxLength: 50, nullable: true),
                    Nome = table.Column<string>(maxLength: 300, nullable: true),
                    Senha = table.Column<string>(maxLength: 150, nullable: true),
                    Status = table.Column<int>(nullable: false),
                    UsuarioCriadoId = table.Column<long>(nullable: true),
                    UsuarioModificadoId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Agendamentos",
                columns: table => new
                {
                    Id = table.Column<long>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DataConsulta = table.Column<DateTime>(nullable: false),
                    DataCriado = table.Column<DateTime>(nullable: false),
                    DataModificado = table.Column<DateTime>(nullable: true),
                    Diagnostico = table.Column<string>(maxLength: 400, nullable: true),
                    MedicoId = table.Column<long>(nullable: false),
                    PacienteId = table.Column<long>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    UsuarioCriadoId = table.Column<long>(nullable: true),
                    UsuarioModificadoId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agendamentos_Medicos_MedicoId",
                        column: x => x.MedicoId,
                        principalTable: "Medicos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Agendamentos_Pacientes_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Pacientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_MedicoId",
                table: "Agendamentos",
                column: "MedicoId");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_PacienteId",
                table: "Agendamentos",
                column: "PacienteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamentos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.DropTable(
                name: "Medicos");

            migrationBuilder.DropTable(
                name: "Pacientes");
        }
    }
}
