var beneficiariosArray = [];
$(document).ready(function () {
   
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #CPF').val(formatarCPF(obj.CPF));
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #Id').val(obj.Id);
    }
    
    $('#formCadastro').submit(function (e) {

        var cpf = $('#CPF').val();
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
                "Beneficiarios": beneficiariosArray 
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })

    $('#modalBeneficiarios').on('shown.bs.modal', function (e) {
        var idCliente = $('#Id').val();

        var jtStartIndex = 0; 
        var jtPageSize = 5; 
        var jtSorting = 'Nome ASC'; 

        $.ajax({
            url: ListPost, 
            type: 'POST',
            data: {
                idCliente: idCliente,
                jtStartIndex: jtStartIndex,
                jtPageSize: jtPageSize,
                jtSorting: jtSorting
            },
            success: function (result) {
                if (result.Result === "OK") {
                    function formatarCPF(cpf) {
                        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                    }

                    $.each(result.Records, function (index, beneficiario) {
                        var cpfFormatado = formatarCPF(beneficiario.CPF);

                        if ($('#beneficiariosGrid').find('td:first').filter(function () {
                            return $(this).text() === cpfFormatado;
                        }).length > 0) {
                            return true; 
                        }

                        var beneficiarioExistente = beneficiariosArray.find(function (item) {
                            return item.CPF === cpfFormatado;
                        });

                        if (!beneficiarioExistente) {
                            beneficiariosArray.push({ IdCliente: beneficiario.IdCliente, Id: beneficiario.Id, CPF: cpfFormatado, Nome: beneficiario.Nome });

                            $('#beneficiariosGrid').append('<tr><td>' + cpfFormatado + '</td><td>' + beneficiario.Nome + '</td><td><button class="btn btn-danger btnRemoverBeneficiario" data-cpf="' + cpfFormatado + '">Remover</button></td></tr>');
                        }
                    });
                } else {
                    alert('Erro ao carregar beneficiários: ' + result.Message);
                }
            },
            error: function () {
                alert('Erro ao carregar beneficiários. Por favor, tente novamente mais tarde.');
            }
        });
    });

    $('#btnIncluirBeneficiario').click(function () {
        var cpf = $('#CPFBeneficiario').val();
        var nome = $('#NomeBeneficiario').val();

        if (cpf.trim() === '' || nome.trim() === '') {
            ModalDialog('Erro', 'Por favor, preencha todos os campos CPF e Nome.');
            return;
        }

        if (cpf.replace(/\D/g, '').length !== 11) {
            ModalDialog('Erro', 'Por favor, insira um CPF válido.');
            return;
        }

        if (beneficiariosArray.some(function (beneficiario) {
            return beneficiario.CPF === cpf;
        })) {
            ModalDialog('Erro', 'CPF já existe na lista de beneficiários.');
            return;
        }

        if ($('#beneficiariosGrid').find('td:first').filter(function () {
            return $(this).text() === cpf;
        }).length > 0) {
            ModalDialog('Erro', 'CPF já existe na tabela de beneficiários.');
            return;
        }

        adicionarBeneficiario(null, null, cpf, nome);
    });


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

    $('#modalBeneficiarios').on('hidden.bs.modal', function () {
        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });
    
})

$(document).on('click', '.btnRemoverBeneficiario', function () {
    var cpf = $(this).closest('tr').find('td:first').text();
    removerBeneficiario(cpf);
});

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

function adicionarBeneficiario(idCliente, id, cpf, nome) {
    beneficiariosArray.push({ IdCliente: idCliente, Id: id, CPF: cpf, Nome: nome });

    $('#beneficiariosGrid').append('<tr><td>' + cpf + '</td><td>' + nome + '</td><td><button class="btn btn-danger btnRemoverBeneficiario" data-cpf="' + cpf + '">Remover</button></td></tr>');
}

function removerBeneficiario(cpf) {
    beneficiariosArray = beneficiariosArray.filter(function (beneficiario) {
        return beneficiario.CPF !== cpf;
    });

    $('#beneficiariosGrid').find('tr').each(function () {
        var tableCpf = $(this).find('td:first').text();
        if (tableCpf === cpf) {
            $(this).remove();
            return false;
        }
    });
}