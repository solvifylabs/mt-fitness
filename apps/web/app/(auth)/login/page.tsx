'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      form.setError('password', { message: 'Credenciales inválidas' });
      return;
    }

    router.push('/dashboard');
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">MT Fitness</h1>
        <p className="mt-2 text-sm text-gray-600">Ingresá a tu cuenta</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="vos@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Continuar con Google
          </Button>

          <p className="text-center text-sm text-gray-600">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Registrate
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
}
