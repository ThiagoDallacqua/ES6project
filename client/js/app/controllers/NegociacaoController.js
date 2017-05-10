class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new Bind(
          new ListaNegociacoes(),
          new NegociacoesView($('#negociacoesView')),
          'adiciona', 'esvazia');

        // ProxyFactory.create(
        //   new ListaNegociacoes(),
        // ['adiciona', 'esvazia'], (model) => this._negociacoesView.update(model));

        this._mensagem = new Bind(
          new Mensagem(),
          new MensagemView($('#mensagemView')),
          'texto'
        );

        // ProxyFactory.create(
        //   new Mensagem(), ['texto'], (model) => this._mensagemView.update(model)
        // );
    }

    adiciona(event) {

        event.preventDefault();
        this._listaNegociacoes.adiciona(this._criaNegociacao());

        this._mensagem.texto = 'Negociação adicionada com sucesso';

        this._limpaFormulario();
    }

    importaNegociacoes(){
      let service = new NegociacaoService();

      service.obterNegociacoesDaSemana((erro, negociacoes) => {
        if(erro){
          this._mensagem.texto = erro;
          return;
        }

        negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
        this._mensagem.texto = 'Negociações importadas com sucesso';
      });
    }

    apaga() {

        this._listaNegociacoes.esvazia();

        this._mensagem.texto = 'Negociações apagadas com sucesso';
    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value);
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }
}
