import React, { useState } from 'react';
import { Image } from 'react-native';
import logo from '../assets/logotipo.png';

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
                    <Image source={logo} style={{ width: 64, height: 64, resizeMode: 'contain' }} />
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
