import React, { useState } from 'react';
import { Image } from 'react-native';
import logo from '../assets/logotipo.png';

// O componente de cadastro em um único formulário rolável
const RegistrationScreen = ({ setCurrentScreen }) => {
    // 1. Cores e Classes
    const primaryDark = 'text-[#052242]';
    const bgPrimaryDark = 'bg-[#052242]';
    const appBg = 'bg-[#F3ECE2]'; 
    const inputBg = 'bg-[#EEEEEE]'; 
    const inputColor = 'text-[#9D9D9D]'; 
    const grayText = 'text-gray-700';

    // 2. Estados
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        email: '', password: '', name: '', surname: '', cpf: '',
        birthDate: '', phone: '', gender: '', cep: '', address: '',
        number: '', complement: '', neighborhood: '', city: '',
        state: '', referencePoint: ''
    });

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        
        
        if (!formData.email || !formData.password || !formData.name || !formData.cpf) {
             setMessage({ type: 'error', text: 'Preencha os campos obrigatórios.' });
             setIsLoading(false);
             setTimeout(() => setMessage(null), 3000);
             return;
        }

        
        setTimeout(() => {
            setMessage({ type: 'success', text: 'Cadastro concluído! Redirecionando para o login.' });
            setIsLoading(false);

            setTimeout(() => {
                setMessage(null);
                
                if (setCurrentScreen) {
                    setCurrentScreen('login'); 
                }
            }, 3000);

        }, 3000);
    };


    
    const FloatingInput = ({ label, name, type = 'text', value, onChange, isRequired = false, children }) => {
        
        return (
            <div className={`relative ${inputBg} px-4 py-2 rounded-xl border-2 border-transparent focus-within:border-[#052242] transition duration-200`}>
                <label
                    htmlFor={name}
                    className={`absolute top-2 left-4 text-xs font-semibold ${inputColor} pointer-events-none`}
                >
                    {label} {isRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    // Aumenta o padding vertical para acomodar o rótulo
                    className={`w-full pt-4 pb-0 bg-transparent ${primaryDark} font-medium text-base focus:outline-none`}
                    required={isRequired}
                    
                    placeholder="" 
                />
                {children}
            </div>
        );
    };

    
    const FloatingSelect = ({ label, name, value, onChange, isRequired = false, options }) => {
        return (
            <div className={`relative ${inputBg} px-4 py-2 rounded-xl border-2 border-transparent focus-within:border-[#052242] transition duration-200`}>
                <label
                    htmlFor={name}
                    className={`absolute top-2 left-4 text-xs font-semibold ${inputColor} pointer-events-none`}
                >
                    {label} {isRequired && <span className="text-red-500">*</span>}
                </label>
                <div className="relative w-full pt-4">
                    <select
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`w-full bg-transparent ${primaryDark} font-medium text-base focus:outline-none appearance-none cursor-pointer`}
                        required={isRequired}
                    >
                        
                        <option value="" disabled className={inputColor}>Selecione...</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value} className={primaryDark}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-[#9D9D9D]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                    </div>
                </div>
            </div>
        );
    };

    
    const RadioOption = ({ label, name, value, currentSelection, onChange }) => {
        const isChecked = currentSelection === value;
        
        
        const radioClasses = isChecked
            ? `w-6 h-6 rounded-full border-2 border-[#052242] ${inputBg} flex items-center justify-center transition duration-200`
            : `w-6 h-6 rounded-full border-2 border-gray-400 ${appBg} flex items-center justify-center transition duration-200`;

        return (
            <label className="flex items-center space-x-3 cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={isChecked}
                    onChange={onChange}
                    className="hidden" // Esconde o input nativo
                />
                <div className={radioClasses}>
                    
                    {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-[#052242]"></div>}
                </div>
                
                <span className={`text-base font-medium ${isChecked ? primaryDark : grayText}`}>{label}</span>
            </label>
        );
    };


    return (
        <div className={`w-full max-w-sm p-8 md:min-h-0 rounded-3xl shadow-2xl ${appBg} overflow-y-auto`}>

            
            <div className="flex flex-col items-center justify-center mb-10 mt-6">
                <Image source={logo} style={{ width: 64, height: 64, resizeMode: 'contain' }} />
                <h1 className={`text-4xl font-extrabold ${primaryDark} tracking-tighter mt-1`}>
                    Olie's <span className="font-normal">sports</span>
                </h1>
            </div>

            
            <h2 className={`text-3xl font-bold ${primaryDark} text-center mb-10`}>
                Criar uma conta
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">

                
                <h3 className={`text-lg font-bold ${primaryDark} mb-3`}>Informações da conta</h3>
                <FloatingInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} isRequired />
                <div className="relative">
                    <FloatingInput label="Senha" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} isRequired>
                        <span
                            className={`absolute top-1/2 right-4 transform translate-y-2 cursor-pointer transition duration-200 ${primaryDark} opacity-60 hover:opacity-100`}
                            onClick={togglePasswordVisibility}
                        >
                            {/* Icone do Olho */}
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
                    </FloatingInput>
                </div>


                
                <h3 className={`text-lg font-bold ${primaryDark} mb-3 mt-8`}>Dados pessoais</h3>
                <FloatingInput label="Nome" name="name" value={formData.name} onChange={handleChange} isRequired />
                <FloatingInput label="Sobrenome" name="surname" value={formData.surname} onChange={handleChange} isRequired />
                <FloatingInput label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} isRequired />
                <FloatingInput label="Data de nascimento" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} isRequired />
                <FloatingInput label="Telefone de contato" name="phone" type="tel" value={formData.phone} onChange={handleChange} isRequired />

                
                <h3 className={`text-lg font-bold ${primaryDark} mb-3 mt-8`}>Gênero</h3>
                <div className="flex space-x-8">
                    <RadioOption 
                        label="Masculino" 
                        name="gender" 
                        value="Masculino" 
                        currentSelection={formData.gender} 
                        onChange={handleChange} 
                    />
                    <RadioOption 
                        label="Feminino" 
                        name="gender" 
                        value="Feminino" 
                        currentSelection={formData.gender} 
                        onChange={handleChange} 
                    />
                </div>

                
                <h3 className={`text-lg font-bold ${primaryDark} mb-3 mt-8`}>Endereço</h3>
                <FloatingInput label="CEP" name="cep" value={formData.cep} onChange={handleChange} isRequired />
                <FloatingInput label="Endereço" name="address" value={formData.address} onChange={handleChange} isRequired />
                <FloatingInput label="Número" name="number" value={formData.number} onChange={handleChange} isRequired />
                <FloatingInput label="Complemento (opcional)" name="complement" value={formData.complement} onChange={handleChange} />
                <FloatingInput label="Bairro" name="neighborhood" value={formData.neighborhood} onChange={handleChange} isRequired />
                <FloatingInput label="Cidade" name="city" value={formData.city} onChange={handleChange} isRequired />

                
                <FloatingSelect 
                    label="Estado" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                    isRequired 
                    options={[
                        { value: 'SP', label: 'São Paulo' },
                        { value: 'RJ', label: 'Rio de Janeiro' },
                        { value: 'MG', label: 'Minas Gerais' },
                        { value: 'BA', label: 'Bahia' },
                        // Adicionar mais estados conforme necessário
                    ]}
                />

                <FloatingInput label="Ponto de referência (opcional)" name="referencePoint" value={formData.referencePoint} onChange={handleChange} />


                
                <div className="pt-8 pb-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full ${bgPrimaryDark} text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-95 transition duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </div>

                
                <div className="text-center text-xs pb-4">
                    <p className="text-gray-600">
                        Já possui cadastro? 
                        <a href="#" onClick={() => setCurrentScreen && setCurrentScreen('login')} className={`${primaryDark} font-semibold hover:underline ml-1`}>Fazer login</a>
                    </p>
                </div>
            </form>

            
            {message && (
                <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-8 p-3 ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white rounded-lg shadow-xl transition-all duration-300 ease-in-out`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default RegistrationScreen;
