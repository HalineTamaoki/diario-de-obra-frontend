import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import type { Usuario } from '../types/Usuario';
import { useDispatch } from 'react-redux';
import { login } from '../features/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { mostrarNotificacao } from '../features/notificacaoSlice';
import { BsEnvelope, BsHammer } from 'react-icons/bs';

export const Login = () => {
    const { register, handleSubmit } = useForm<Usuario>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = useCallback((data: Usuario) => {
        try {
            dispatch(login(data)).unwrap();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-(--main2) to-(--main) flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-(--main) rounded-full mb-4">
                        <BsHammer className="w-8 h-8 text-(--white)" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Diário de Obra</h1>
                    <p>Faça login para continuar</p>
                </div>
                <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            E-mail
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <BsEnvelope className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                            placeholder="seu@email.com"
                            />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                    </div>

                    {/* Campo de Senha */}
                    <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-12 py-3 border ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                        placeholder="••••••••"
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                    </div>

                    {/* Lembrar-me e Esqueci a senha */}
                    <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={formData.remember}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Lembrar-me
                        </label>
                    </div>
                    <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-600">
                        Esqueci a senha
                    </a>
                    </div>

                    {/* Botão de Login */}
                    <button
                        type='submit'
                        className="w-full bg-(--main) text-(--white) py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                    >
                        Entrar
                    </button>
                </form>

                {/* Link de Cadastro */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                    Cadastre-se
                    </a>
                </p>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-600">
                © 2026 Diário de Obra. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}