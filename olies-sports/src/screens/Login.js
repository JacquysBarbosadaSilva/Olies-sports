import React, { useState } from 'react';
import { Image } from 'react-native';

const logoUrl = "https://olies-ports.s3.us-east-1.amazonaws.com/img/logotipo.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4RCJUVETB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T213109Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIF5r9n3SlIlwrWIih6WGQBbM0tGPsmu0u7PQwsqhz%2BPlAiEAzLnLGZ5HWc0lLBpQCkn8Ylt59i%2BhXca%2BCmKpOjpOQeIqgwMINxAAGgw2NzEwNTQ0OTczMzciDDFO1pKJNryxXbCVoyrgAmMmOaS%2BflOGH6QAoaH6tzhwkvCfOw1wekhWdxd6GUAlmfhHfXztqglXHvi2%2FQTpdwpgBqVFOX54Jr9tA%2FG%2BhCyO9tJQWvEGsSpNrutHIdNSftmozjutyzZYH6KLii%2BZaAP%2BCN3lYeN%2FB%2FJLvosSMsCPw7pxl6xzcYL4d6GTtqsKlK6Kcv%2BDODZWmZe3jPJKj1%2FjO%2B203fQN9Dtx1ggorUTAuKfTXzaCnYvkpRPCJ2F6052rKZnjND%2FGmyvflyFr7JnTgKF3HVI164zMpxtFN%2BspzP5UBHMui0wtJR7XtVQbr8rytz4f6DYoDmL4RVxX0uGr2%2BCK1b6tGzOiEdLBsgZ21Z0e4%2Fl%2FjG%2FuxejOUZfQwhJpHnY5kbMu1oyYUKvuKTsyAgktsLbNkMG1WuopiJXaQKj%2Fcl%2BH0x0KXYz3q8mttq8QUpqOmh9rnkc6DxEMGmIWHzB9rLtRvhN7uc9PWXQwgNzkxwY6hwKiJY9COGoIhCXtEd48aip89g9td2xbtd54Ojr2N4wznAW2oK1ufZ9OTiMIo8tuOL%2BUhJigtU3KxkJugU2JVjLAnDctb6AImhjY4ULdlqxP35%2FI3LHaM1t5Wiw7ltZ3laOJ0FsSDiNt693oroD3pSBxs%2B4R01ye3Ra62%2B7w7wkJxGLcPLOHraDS36OLrSQh4jOAjiOey%2BrKt7t6QaiJgFu4qRVWLA23wQzhYTMRNpTzaTzU26pewVPuRhE5y7X82XqNiNdum8vVwd2KO6ZHlOWxKDqhiOV4PnOoNYGuDj99HpOK6hE8UIThBdCQAshDTd6VKPUYsMEc%2FQZQWUvQHDSYA31Mc7nikQ%3D%3D&X-Amz-Signature=11eb26d8eb399b6d2f91c9721a92839350d8a784acefe0d988a547de57c03b6f&X-Amz-SignedHeaders=host&response-content-disposition=inline";

const App = () => {
    const [email, setEmail] = useState('victorkoba08@gmail.com');
    const [password, setPassword] = useState('***********');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        setTimeout(() => {
            setMessage({ type: 'success', text: 'Login efetuado com sucesso!' });
            setTimeout(() => {
                setIsLoading(false);
                setMessage(null);
            }, 2000);
        }, 2000);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const primaryDark = 'text-[#052242]';
    const bgPrimaryDark = 'bg-[#052242]';
    const appBg = 'bg-[#F3ECE2]';
    const inputColor = 'text-[#9D9D9D]';
    const inputBg = 'bg-[#EEEEEE]';
    const inputClasses = `w-full p-3 md:p-4 border-none rounded-xl ${inputBg} ${inputColor} font-medium text-base pr-12 focus:outline-none focus:ring-2 focus:ring-[#052242] focus:ring-offset-1`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#f0f0f0] p-4">
            <div className={`w-full max-w-sm p-8 md:min-h-0 rounded-3xl shadow-2xl ${appBg}`}>
                <div className="flex flex-col items-center justify-center mb-10 mt-6">
                    <Image source={{uri: logoUrl}} style={{ width: 64, height: 64, resizeMode: 'contain' }} />
                    <h1 className={`text-4xl font-extrabold ${primaryDark} tracking-tighter mt-1`}>
                        Olie's <span className="font-normal">sports</span>
                    </h1>
                </div>

                <h2 className={`text-3xl font-bold ${primaryDark} text-center mb-10`}>
                    Entre na<br/>sua conta
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClasses} 
                                placeholder="victorkoba08@gmail.com" 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 block mb-1">Senha</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                name="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClasses} 
                                placeholder="***********" 
                                required 
                            />
                            <span 
                                className={`absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer transition duration-200 ${primaryDark} opacity-60 hover:opacity-100`}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.536-2.583m6.142 8.166A2.999 2.999 0 0012 15a3 3 0 00-3-3m3 3a3 3 0 003-3m-6 3l-4.5 4.5M21 12c-1.275 4.057-5.065 7-9.543 7a9.97 9.97 0 01-1.536-.183M10 12l-4.5 4.5m10-4.5L12 12m0 0l-4.5 4.5"></path>
                                    </svg>
                                )}
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-xs pt-1 space-y-2">
                        <p className="text-gray-600">
                            Não possue cadastro? 
                            <a href="#" className={`${primaryDark} font-semibold hover:underline`}>Clique aqui</a>
                        </p>
                        <p className="text-gray-600">
                            <a href="#" className={`${primaryDark} font-semibold hover:underline`}>Esqueceu sua senha?</a>
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full ${bgPrimaryDark} text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition duration-300 mt-8 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Carregando...' : 'Entrar'}
                    </button>
                    
                </form>

                {message && (
                    <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8 p-3 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg shadow-xl transition-all duration-300 ease-in-out`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
