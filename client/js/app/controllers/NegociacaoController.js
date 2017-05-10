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

      // service.obterNegociacoesDaSemana((erro, negociacoes) => {
      //   if(erro){
      //     this._mensagem.texto = erro;
      //     return;
      //   }
      //
      //   negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //
      //   service.obterNegociacoesDaSemanaAnterior((erro, negociacoes) => {
      //     if(erro){
      //       this._mensagem.texto = erro;
      //       return;
      //     }
      //
      //     negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //
      //     service.obterNegociacoesDaSemanaRetrasada((erro, negociacoes) => {
      //       if(erro){
      //         this._mensagem.texto = erro;
      //         return;
      //       }
      //
      //       negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //       this._mensagem.texto = 'Negociações importadas com sucesso';
      //     });
      //   });
      // });
      //piramid of doom

      // service.obterNegociacoesDaSemana()
      //   .then(negociacoes => {
      //     negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //     this._mensagem.texto = 'Negociações da semana obtida com sucesso.';
      //   }).catch(erro => this._mensagem.texto = erro);
      //
      // service.obterNegociacoesDaSemanaAnterior()
      //   .then(negociacoes => {
      //     negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //     this._mensagem.texto = 'Negociações da semana anterior obtida com sucesso.';
      //   }).catch(erro => this._mensagem.texto = erro);
      //
      // service.obterNegociacoesDaSemanaRetrasada()
      //   .then(negociacoes => {
      //     negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
      //     this._mensagem.texto = 'Negociações da semana retrasada obtida com sucesso.';
      //   }).catch(erro => this._mensagem.texto = erro);
      //promise pattern, but still getting the wrong order

      Promise.all([
        service.obterNegociacoesDaSemana(),
        service.obterNegociacoesDaSemanaAnterior(),
        service.obterNegociacoesDaSemanaRetrasada()
      ]).then(negociacoes => {
        console.log(negociacoes); //receive an arry of arrays

        negociacoes
        .reduce((arrayAchatado, array) => arrayAchatado.concat(array),[]) //transform the collection of arrays into one single array
        .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
        this._mensagem.texto = 'Negociações importadas com sucesso.';
      }).catch(erro => this._mensagem.texto = erro);
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
