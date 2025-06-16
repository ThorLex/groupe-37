// components/preenrol/PaymentStep.tsx

import { useFormContext } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Clé publique Stripe (env var)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CardPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const amount = 5000; // en centimes

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    // Appel au mock API
    const { sessionId } = await fetch('/api/create-stripe-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    }).then(res => res.json());

    // Pour simuler sans backend opérationnel :
    // alert('Paiement simulé, sessionId=' + sessionId);
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <form onSubmit={handleCardSubmit} className="space-y-4">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        disabled={!stripe}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Payer {amount / 100} €
      </button>
    </form>
  );
}

export default function PaymentStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const method = watch('paymentMethod');

  return (
    <div className="space-y-4">
      <label className="block">Mode de paiement</label>
      <select
        {...register('paymentMethod')}
        className="w-full px-4 py-2 border rounded"
      >
        <option value="">Sélectionnez</option>
        <option value="card">Carte bancaire</option>
        <option value="mobileMoney">Mobile Money</option>
      </select>
      {errors.paymentMethod && (
        <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
      )}

      {method === 'card' && (
        <Elements stripe={stripePromise}>
          <CardPaymentForm />
        </Elements>
      )}

      {method === 'mobileMoney' && (
        <p>Instructions pour Mobile Money à implémenter</p>
      )}
    </div>
  )
}
