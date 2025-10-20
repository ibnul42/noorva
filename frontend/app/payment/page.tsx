
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Page() {
	const [method, setMethod] = useState<'card' | 'mobile' | 'bank' | null>('card')
	const price = 2500

	// Card fields
	const [cardNumber, setCardNumber] = useState('')
	const [expiry, setExpiry] = useState('')
	const [cvv, setCvv] = useState('')
	const [cardName, setCardName] = useState('')

	// Mobile fields
	const [mfsProvider, setMfsProvider] = useState('')
	const [mobileNumber, setMobileNumber] = useState('')
	const [mfsPin, setMfsPin] = useState('')

	// Bank fields
	const [bankName, setBankName] = useState('')
	const [accountNumber, setAccountNumber] = useState('')
	const [routingNumber, setRoutingNumber] = useState('')
	const [accountHolder, setAccountHolder] = useState('')

	const [submitting, setSubmitting] = useState(false)

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-6">
			<div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 ring-1 ring-slate-200">
				<h2 className="text-center text-2xl font-bold text-emerald-700">Complete Your Subscription</h2>
				<p className="text-center text-sm text-slate-500 mt-2">Choose your payment method to access the Database Management System</p>

				<div className="mt-6 bg-emerald-700 rounded-lg p-6 text-white shadow-inner">
					<h3 className="text-center font-semibold">Professional Plan</h3>
					<div className="text-center mt-4">
						<div className="text-4xl font-extrabold">৳{price.toLocaleString()}</div>
						<div className="text-sm mt-1 text-emerald-100">per month</div>
					</div>

					<ul className="mt-6 space-y-2 text-sm list-inside">
						<li>✓ Access to all 5 database systems</li>
						<li>✓ Unlimited data storage</li>
						<li>✓ 24/7 customer support</li>
						<li>✓ Advanced reporting & analytics</li>
						<li>✓ Multi-user collaboration</li>
					</ul>
				</div>

				<h4 className="mt-6 text-center font-medium">Select Payment Method</h4>

				<div className="mt-4 grid grid-cols-3 gap-3">
					<button type="button" onClick={() => setMethod('card')} className={`p-4 cursor-pointer rounded-lg border ${method === 'card' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white'} flex flex-col items-center gap-2`}>
						<div className="w-8 h-6 bg-emerald-100 rounded-sm flex items-center justify-center text-emerald-700">💳</div>
						<div className="text-xs">Credit/Debit Card</div>
					</button>

					<button type="button" onClick={() => setMethod('mobile')} className={`p-4 cursor-pointer rounded-lg border ${method === 'mobile' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white'} flex flex-col items-center gap-2`}>
						<div className="w-8 h-6 bg-emerald-100 rounded-sm flex items-center justify-center text-emerald-700">📱</div>
						<div className="text-xs">Mobile Banking</div>
					</button>

					<button type="button" onClick={() => setMethod('bank')} className={`p-4 cursor-pointer rounded-lg border ${method === 'bank' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white'} flex flex-col items-center gap-2`}>
						<div className="w-8 h-6 bg-emerald-100 rounded-sm flex items-center justify-center text-emerald-700">🏦</div>
						<div className="text-xs">Bank Transfer</div>
					</button>
				</div>

						<div className="mt-6">
							{method === 'card' && (
								<div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
									<h5 className="font-semibold mb-3">💳 Credit/Debit Card Payment</h5>
									<label className="text-sm">Card Number</label>
									<input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2" />

									<div className="mt-3 grid grid-cols-3 gap-3">
										<div>
											<label className="text-sm">Expiry Date</label>
											<input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
										</div>
										<div className="col-span-2">
											<label className="text-sm">CVV</label>
											<input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
										</div>
									</div>

									<div className="mt-3">
										<label className="text-sm">Cardholder Name</label>
										<input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" className="mt-2 block w-full rounded-lg border border-slate-200 px-4 py-2" />
									</div>
								</div>
							)}

							{method === 'mobile' && (
								<div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
									<h5 className="font-semibold mb-3">📱 Mobile Financial Services</h5>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="text-sm">MFS Provider</label>
											<select value={mfsProvider} onChange={e => setMfsProvider(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2">
												<option value="">Select Provider</option>
												<option value="bkash">bKash</option>
												<option value="rocket">Rocket</option>
												<option value="nagad">Nagad</option>
											</select>
										</div>
										<div>
											<label className="text-sm">Mobile Number</label>
											<input value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+880 1XXX-XXXXXX" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
										</div>
									</div>
									<div className="mt-3">
										<label className="text-sm">PIN</label>
										<input value={mfsPin} onChange={e => setMfsPin(e.target.value)} placeholder="Enter your MFS PIN" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
									</div>
								</div>
							)}

							{method === 'bank' && (
								<div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
									<h5 className="font-semibold mb-3">🏦 Bank Transfer</h5>
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="text-sm">Bank Name</label>
											<select value={bankName} onChange={e => setBankName(e.target.value)} className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2">
												<option value="">Select Bank</option>
												<option>Bank A</option>
												<option>Bank B</option>
												<option>Bank C</option>
											</select>
										</div>
										<div>
											<label className="text-sm">Account Number</label>
											<input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter account number" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
										</div>
									</div>

									<div className="mt-3 grid grid-cols-2 gap-3">
										<div>
											<label className="text-sm">Routing Number</label>
											<input value={routingNumber} onChange={e => setRoutingNumber(e.target.value)} placeholder="Enter routing number" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
										</div>
										<div>
											<label className="text-sm">Account Holder Name</label>
											<input value={accountHolder} onChange={e => setAccountHolder(e.target.value)} placeholder="Enter account holder name" className="mt-2 block w-full rounded-lg border border-slate-200 px-3 py-2" />
										</div>
									</div>
								</div>
							)}

							<div className="mt-4 p-4 bg-sky-50 border border-sky-100 rounded text-sm text-sky-800">🔒 Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.</div>

							<button
								disabled={submitting}
								onClick={async () => {
									setSubmitting(true)
									  // minimal validation
									  const payload: Record<string, unknown> = { method, amount: price }
									if (method === 'card') payload.card = { cardNumber, expiry, cvv, cardName }
									if (method === 'mobile') payload.mfs = { mfsProvider, mobileNumber, mfsPin }
									if (method === 'bank') payload.bank = { bankName, accountNumber, routingNumber, accountHolder }

									console.log('Submitting payment payload', payload)
									// TODO: call backend endpoint to create payment intent
									await new Promise(r => setTimeout(r, 700))
									alert('Payment submitted (mock)')
									setSubmitting(false)
								}}
								className="mt-6 cursor-pointer w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg"
							>
								{submitting ? 'Processing...' : `Complete Payment - ৳${price.toLocaleString()}`}
							</button>
						</div>

				<div className="mt-4 text-center text-sm">
					<Link href="/login" className="text-emerald-700 underline">← Back to Login</Link>
				</div>
			</div>
		</div>
	)
}

