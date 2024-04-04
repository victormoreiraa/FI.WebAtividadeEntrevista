
$(document).ready(function () {
    var beneficiarios = [];



    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); 
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); 
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); 

        return cpf;
    }

    $('#CPFBeneficiario').on('input', function () {
        var cpf = $(this).val();
        $(this).val(formatarCPF(cpf));
    });

    $('#CPF').on('input', function () {
        var cpf = $(this).val();
        $(this).val(formatarCPF(cpf));
    });


    $('#btnIncluirBeneficiario').click(function () {
        var cpf = $('#CPFBeneficiario').val();
        var nome = $('#NomeBeneficiario').val();

        if (cpf.trim() === '' || nome.trim() === '') {
            ModalDialog("Erro", "Por favor, preencha todos os campos.");
            return;
        }

        if (cpf.replace(/\D/g, '').length !== 11) {
            ModalDialog('Erro', 'Por favor, insira um CPF válido.');
            return;
        }

        if (beneficiarios.some(function (beneficiario) {
            return beneficiario.CPF === cpf;
        })) {
            ModalDialog('Erro', 'CPF já existe na lista de beneficiários.');
            return;
        }

        if ($('#beneficiariosGrid').find('td:first').filter(function () {
            return $(this).text() === cpf;
        }).length > 0) {
            ModalDialog('Erro', 'CPF já cadastrado');
            return;
        }

        var newRow = '<tr><td class="cpfBeneficiario">' + cpf + '</td><td class="nomeBeneficiario">' + nome + '</td><td><button class="btnExcluirBeneficiario btn btn-sm btn-danger">Excluir</button></td></tr>';
        $('#beneficiariosGrid').append(newRow);

        beneficiarios.push({ cpf: cpf, nome: nome });

        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });

    $(document).on('click', '.btnExcluirBeneficiario', function () {
        var row = $(this).closest('tr');
        var cpf = row.find('.cpfBeneficiario').text();
        var nome = row.find('.nomeBeneficiario').text();

       
            row.remove();

            beneficiarios = beneficiarios.filter(function (item) {
                return item.cpf !== cpf && item.nome !== nome;
            });
       
    });

    $('#formCadastro').submit(function (e) {
        var cpf = $(this).find("#CPF").val();

        if (cpf.replace(/\D/g, '').length !== 11) {
            ModalDialog('Erro', 'Por favor, insira um CPF válido.');
            return false;
        }

        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "CPF": $(this).find("#CPF").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": beneficiarios
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
                beneficiarios = [];
                $('#CPFBeneficiario').val('');
                $('#NomeBeneficiario').val('');
                $('#beneficiariosGrid').empty();
            }
        });
    });

    $('#modalBeneficiarios').on('hidden.bs.modal', function () {
        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });

})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
