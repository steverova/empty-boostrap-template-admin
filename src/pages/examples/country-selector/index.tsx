import { useState } from 'react'
import { Card } from 'react-bootstrap'
import CountrySelector, { codeToFlag, type CountryItem } from '@/components/shared/country-selector'

export function Component() {
	const [country, setCountry] = useState<CountryItem | null>(null)
	const [countryNoFlag, setCountryNoFlag] = useState<CountryItem | null>(null)
	const [countryWithCode, setCountryWithCode] = useState<CountryItem | null>(null)

	return (
		<div className='container py-4'>
			<h4 className='mb-4'>Country Selector</h4>

			<div className='d-flex flex-column gap-4' style={{ maxWidth: 480 }}>
				<div>
					<h6>Por defecto (con bandera)</h6>
					<CountrySelector
						value={country}
						onChange={(val) => setCountry(val as CountryItem | null)}
					/>
					{country && (
						<p className='mt-2 text-muted small mb-0'>
							Seleccionado: {country.flag} {country.name} ({country.code})
						</p>
					)}
				</div>

				<hr />

				<div>
					<h6>Sin bandera</h6>
					<CountrySelector
						showFlag={false}
						value={countryNoFlag}
						onChange={(val) => setCountryNoFlag(val as CountryItem | null)}
						placeholder='Solo nombre del país'
					/>
				</div>

				<hr />

				<div>
					<h6>Con código ISO visible</h6>
					<CountrySelector
						showCode
						value={countryWithCode}
						onChange={(val) => setCountryWithCode(val as CountryItem | null)}
						placeholder='País + código'
					/>
				</div>

				<hr />

				<div>
					<h6>Deshabilitado</h6>
					<CountrySelector
						value={{ code: 'MX', name: 'Mexico', flag: codeToFlag('MX') }}
						isDisabled
					/>
				</div>

				<hr />

				<div>
					<h6>Card de ejemplo</h6>
					<Card>
						<Card.Body>
							<div className='d-flex flex-column gap-3'>
								<div>
									<label className='form-label small text-muted'>País de origen</label>
									<CountrySelector
										value={country}
										onChange={(val) => setCountry(val as CountryItem | null)}
									/>
								</div>
								{country && (
									<div className='text-muted small'>
										{country.flag} {country.name} — código ISO: {country.code}
									</div>
								)}
							</div>
						</Card.Body>
					</Card>
				</div>
			</div>
		</div>
	)
}
