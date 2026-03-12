const api = "/api/contatos";
let contatosCache = [];
let editingId = null;

function salvarContato() {
    if (editingId) {
        atualizarContato(editingId);
    } else {
        cadastrarContato();
    }
}

function cadastrarContato() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const observacao = document.getElementById("observacao").value;

    if (!nome || !telefone) {
        alert("Nome e Telefone são obrigatórios!");
        return;
    }

    fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, email, observacao })
    })
    .then(async res => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Erro ${res.status} ao salvar contato`);
        }
        return res.json();
    })
    .then(() => {
        listarContatos();
        limparCampos();
    })
    .catch(err => {
        console.error(err);
        alert(`Erro ao salvar contato: ${err.message}`);
    });
}

function atualizarContato(id) {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const observacao = document.getElementById("observacao").value;

    if (!nome || !telefone) {
        alert("Nome e Telefone são obrigatórios!");
        return;
    }

    fetch(`${api}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, email, observacao })
    })
    .then(async res => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `Erro ${res.status} ao atualizar contato`);
        }
        return res.json();
    })
    .then(() => {
        cancelarEdicao();
        listarContatos();
    })
    .catch(err => {
        console.error(err);
        alert(`Erro ao atualizar contato: ${err.message}`);
    });
}

function iniciarEdicao(id) {
    // O MySQL pode retornar ids como string; use comparação flexível para garantir que o contato seja encontrado.
    const contato = contatosCache.find(c => String(c.id) === String(id));
    if (!contato) return;

    editingId = id;
    document.getElementById("nome").value = contato.nome;
    document.getElementById("telefone").value = contato.telefone;
    document.getElementById("email").value = contato.email;
    document.getElementById("observacao").value = contato.observacao || "";

    document.getElementById("btnSalvar").textContent = "Salvar";
    document.getElementById("btnCancelar").style.display = "inline-block";
}

function cancelarEdicao() {
    editingId = null;
    limparCampos();
    document.getElementById("btnSalvar").textContent = "Cadastrar";
    document.getElementById("btnCancelar").style.display = "none";
}

function listarContatos() {
    fetch(api)
    .then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(text || 'Falha ao listar contatos');
            });
        }
        return res.json();
    })
    .then(contatos => {
        contatosCache = contatos;
        const tabela = document.getElementById("tabelaContatos");
        tabela.innerHTML = "";

        contatos.forEach(c => {
            tabela.innerHTML += `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.nome}</td>
                    <td>${c.telefone}</td>
                    <td>${c.email}</td>
                    <td>${c.observacao || ''}</td>
                    <td>
                        <button onclick="iniciarEdicao(${c.id})">Editar</button>
                        <button onclick="deletarContato(${c.id})">Excluir</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(err => {
        console.error(err);
        alert('Erro ao listar contatos. Veja o console para mais detalhes.');
    });
}

function deletarContato(id) {
    if(confirm("Deseja excluir este contato?")) {
        fetch(`${api}/${id}`, { method: "DELETE" })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `Erro ${res.status} ao deletar contato`);
            }
            if (editingId === id) cancelarEdicao();
            listarContatos();
        })
        .catch(err => {
            console.error(err);
            alert(`Erro ao excluir contato: ${err.message}`);
        });
    }
}

function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("observacao").value = "";
}

// Inicializa a lista
listarContatos();