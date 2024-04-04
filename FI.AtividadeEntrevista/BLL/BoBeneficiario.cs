using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {

        public long Incluir(DML.Beneficiario beneficiario)
        {
            DAL.Clientes.DaoBeneficiario ben = new DAL.Clientes.DaoBeneficiario();
            return ben.Incluir(beneficiario);
        }


        public List<DML.Beneficiario> Pesquisa(long idcliente, int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.Clientes.DaoBeneficiario ben = new DAL.Clientes.DaoBeneficiario();
            return ben.Pesquisa(idcliente, iniciarEm, quantidade, campoOrdenacao, crescente, out qtd);
        }

        public void ExcluirEIncluirBeneficiarios(long idCliente, List<Beneficiario> novosBeneficiarios)
        {
            DAL.Clientes.DaoBeneficiario daoBeneficiario = new DAL.Clientes.DaoBeneficiario();

            daoBeneficiario.ExcluirBeneficiarios(idCliente);

            foreach (var beneficiario in novosBeneficiarios)
            {
                daoBeneficiario.Incluir(beneficiario);
            }
        }


      
    }
}
