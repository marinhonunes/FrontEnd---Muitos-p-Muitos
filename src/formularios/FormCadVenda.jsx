import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Container } from "react-bootstrap";
import BarraBusca from "../meusComponentes/busca/BarraBusca";
import CaixaSelecao from "../meusComponentes/busca/CaixaSelecao";
import TabelaItensVenda from "../tabelas/TabelaItensVenda";

export default function FormCadVenda(props) {
  const [validado, setValidado] = useState(false);
  const [listaClientes, setListaClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState({});
  const [FuncionarioSelecionado, setFuncionarioSelecionado] = useState({});
  // const [qtdItem, setQtdItem] = useState(0);
  // const [subTotalCalculado, setSubTotalCalculado] = useState(0.00);

  //O estado venda possui correlação com a venda gerenciada no backend
  const [ordem, setOrdem] = useState({
    id: 0,
    dataOrdem: "",
    total: 0,
    cliente: {
      codigo: clienteSelecionado.codigo,
    },
    itens: [],
  });

  useEffect(() => {
    fetch("http://localhost:3001/cliente", { method: "GET" })
      .then((resposta) => {
        return resposta.json();
      })
      .then((listaClientes) => {
        setListaClientes(listaClientes);
      })
      .catch((erro) => {
        //Informar o erro em um componente do tipo Mensagem
        alert("Não foi possível recuperar os clientes do backend.");
      });
  }, []); //willMount

  function manipularMudanca(e) {
    const alvo = e.target.name;
    if (e.target.type === "checkbox") {
      //spread operator = operador de espalhamento
      setOrdem({ ...ordem, [alvo]: e.target.checked });
    } else {
      //spread operator = operador de espalhamento
      setOrdem({ ...ordem, [alvo]: e.target.value });
    }
  }

  function gravarVenda() {
    //gravar no backend
  }

  const manipulaSubmissao = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity()) {
      setValidado(false);
      gravarVenda();
    } else {
      setValidado(true);
    }
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Form noValidate validated={validado} onSubmit={manipulaSubmissao}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="idOrdem">
          <Form.Label>Ordem de Serviço nº</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="0"
            defaultValue="0"
            disabled
            name="id"
            value={ordem.id}
            onChange={manipularMudanca}
          />
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="dataOrdem">
          <Form.Label>Data da Ordem</Form.Label>
          <Form.Control
            type="date"
            required
            name="dataOrdem"
            value={ordem.dataOrdem}
            onChange={manipularMudanca}
          />
          <Form.Control.Feedback type="invalid">
            Por favor informe a data da Ordem.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="total">
          <Form.Label>Total da Ordem</Form.Label>
          <Form.Control
            type="text"
            placeholder="0,00"
            value={ordem.total}
            name="total"
            onChange={manipularMudanca}
            required
            disabled
          />
          <Form.Control.Feedback type="invalid">
            Por favor, informe o valor total da Ordem
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} md="12" controlId="valorTotalTributos">
          <Form.Label>Cliente:</Form.Label>
          <BarraBusca
            campoBusca={"nome"}
            campoChave={"cpf"}
            dados={listaClientes}
            funcaoSelecao={setClienteSelecionado}
            placeHolder={"Selecione um cliente"}
            valor={""}
          />
        </Form.Group>
      </Row>
      <Row>
        {
          //Seção resposável por permitir que produtos sejam selecionados para a venda
          //Demonstração de relacionamento muitos para muitos
        }
        <Container className="m-3 border">
          <Row className="m-3">
            <Col md={2}>
              <Form.Label>Selecione o Funcionario:</Form.Label>
            </Col>
            <Col>
              <CaixaSelecao
                enderecoFonteDados={"http://localhost:3001/funcionario"}
                campoChave={"codigo"}
                campoExibicao={"nome"}
                funcaoSelecao={setFuncionarioSelecionado}
              />
            </Col>
          </Row>
          <Row>
            {
              //Seção ficará responsável por detalhar o produto selecionado
            }
            <Col md={10}>
              <Row>
                <Col md={1}>
                  <Form.Group>
                    <Form.Label>ID:</Form.Label>
                    <Form.Control
                      type="text"
                      value={FuncionarioSelecionado?.codigo}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Descrição do Serviço:</Form.Label>
                    <Form.Control type="text" id="descricaoDoServico" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Valor R$:</Form.Label>
                    <Form.Control type="text" id="valorR" />
                  </Form.Group>
                </Col>

                <Col md={1} className="middle">
                  <Form.Group>
                    <Form.Label>Adicionar</Form.Label>
                    <Button
                      onClick={() => {
                        setOrdem({
                          ...ordem,
                          itens: [
                            ...ordem.itens,
                            {
                            codigo: FuncionarioSelecionado?.codigo,
                            descricao:
                            document.getElementById("descricaoDoServico").value, 
                            preco: document.getElementById("valorR").value,
                            },
                          ],
                        });
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-bag-plus-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z"
                        />
                      </svg>
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <p>
              <strong>Ordens de Serviço</strong>
            </p>
            <TabelaItensVenda
              listaItens={ordem.itens}
              setOrdem={setOrdem}
              dadosOrdem={ordem}
            />
          </Row>
        </Container>
      </Row>
      <Button type="submit">Criar OS</Button>
    </Form>
  );
}
