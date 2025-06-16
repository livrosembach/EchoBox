import React from "react";
import startPeople from "../assets/startPeople.png";
import '../css/LandingPage.css';

const LandingPage: React.FC<{}> = ({ }) => {
    return (
        <div className="container">
            <div className="text">
                <div className="bold-phrase">
                    Dê voz às suas ideias.<br />
                    O feedback certo transforma tudo.
                </div>
                <div className="light-text">
                    Crie sua conta, escolha a categoria e a empresa.Acompanhe tudo em um painel simples e intuitivo.
                    <br />
                    Receba respostas, contribua com melhorias e fortaleça a comunicação com as empresas.
                </div>
                <div className="button-start-now">
                    <button onClick={() => { window.location.href = '/login'; }}>Comece agora!</button>
                </div>
            </div>
            <div className="image">
                <img src={startPeople} className="start-people-img" alt="Pessoas expressando feedbacks" />
            </div>
        </div>
    );
};

export default LandingPage;