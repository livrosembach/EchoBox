import React from "react";
import startPeople from "../assets/startPeople.png";

const LandingPage: React.FC<{}> = ({}) => {
    return (
        <div className="start-container">
            <div className="text">
                <div className="bold-phrase">
                    Dê voz às suas ideias.<br />
                    O feedback certo transforma tudo.
                </div>
                <div className="light-text">
                    Crie sua conta, escolha a categoria mais adequada, defina se sua mensagem será pública ou privada e acompanhe tudo em um painel intuitivo.
                    <br />
                    Receba respostas, promova melhorias e fortaleça a comunicação entre equipes ou comunidades.
                </div>
                <div className="button-start-now">
                    <button>Comece agora!</button>
                </div>
            </div>
            <div className="image">
                <img src={startPeople} className="start-people-img" alt="Pessoas expressando feedbacks" />
            </div>
        </div>
    );
};

export default LandingPage;