import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { service } from '../service'
import Countdown from 'react-countdown'
import {
	CircularProgress,
	FormControl,
	FormControlLabel,
	MobileStepper,
	Radio,
	RadioGroup,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { GitHub } from '@mui/icons-material'

export default function Quiz() {
	const [questions, setQuestions] = useState([])
	const [selectedValue, setSelectedValue] = useState('')
	const [isNextDisabled, setIsNextDisabled] = useState(true)
	const [isBackDisabled, setIsBackDisabled] = useState(false)
	const [isOptionsDisabled, setIsOptionsDisabled] = useState(true)
	const [endTime, setEndTime] = useState(Date.now() + 30000)
	const [isLoading, setIsLoading] = useState(false)
	const [countdownKey, setCountdownKey] = useState(0)
	const [stepperVariant, setStepperVariant] = useState('progress')
	const [activeStep, setActiveStep] = useState(0)
	const [quizArray, setQuizArray] = useState([])
	const [quizData, setQuizData] = useState({
		quiz_begin_time: Date.now(),
		answers: Array(10).fill(''),
		quiz_end_time: null,
	})

	const theme = useTheme()
	const navigate = useNavigate()

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 650) {
				setStepperVariant('text')
			} else {
				setStepperVariant('progress')
			}
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const getQuestions = async () => {
		setIsLoading(true)
		const response = await service.getQuestions()
		setQuestions(response.data)
		setIsLoading(false)
	}

	const handleNext = () => {
		setQuizData((prevQuizData) => {
			const updatedAnswers = [...prevQuizData.answers]
			updatedAnswers[activeStep] = selectedValue
			return { ...prevQuizData, answers: updatedAnswers }
		})

		setActiveStep((prevActiveStep) => {
			const nextStep = prevActiveStep + 1
			if (nextStep < questions.length) {
				const newEndTime = Date.now() + 30000
				setEndTime(newEndTime)
				setIsNextDisabled(true)
				setIsBackDisabled(true)
				setIsOptionsDisabled(true)
				setTimeout(() => {
					setIsOptionsDisabled(false)
					setIsNextDisabled(false)
				}, 10000)
				setCountdownKey((prevKey) => prevKey + 1)
			}
			setSelectedValue(quizData.answers[nextStep] || '')
			return nextStep
		})
	}

	const handleBack = () => {
		setActiveStep((prevActiveStep) => {
			const prevStep = prevActiveStep - 1
			setSelectedValue(quizData.answers[prevStep] || '')
			return prevStep
		})
	}

	const handleRadioChange = (event) => {
		setSelectedValue(event.target.value)
		if (!isNextDisabled) {
			setIsNextDisabled(false)
		}
	}

	const handleVisibilityChange = () => {
		if (document.visibilityState === 'visible') {
			setEndTime(Date.now() + (endTime - Date.now()))
		}
	}

	const handleQuizEnd = () => {
		const updatedQuizData = {
			...quizData,
			quiz_end_time: Date.now(),
		}

		const updatedQuizArray = [...quizArray, updatedQuizData]
		localStorage.setItem('quizArray', JSON.stringify(updatedQuizArray))
		navigate('/')
	}

	useEffect(() => {
		const storedQuizArray = localStorage.getItem('quizArray')
		if (storedQuizArray) {
			setQuizArray(JSON.parse(storedQuizArray))
		}
	}, [])

	useEffect(() => {
		getQuestions()
	}, [])

	useEffect(() => {
		setIsNextDisabled(true)
		setIsOptionsDisabled(true)
		setTimeout(() => {
			setIsOptionsDisabled(false)
			setIsNextDisabled(false)
		}, 10000)
	}, [activeStep])

	useEffect(() => {
		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	}, [endTime])

	return (
		<>
			{isLoading ? (
				<div className='flex justify-center items-center w-screen h-screen'>
					<CircularProgress />
				</div>
			) : (
				<>
					<div className='w-full h-screen flex flex-col justify-center items-center'>
						<div className='rounded-md shadow-lg p-3 m-3'>
							<div className='p-3 m-3 max-w-[600px] flex flex-col justify-center items-center gap-6'>
								<div className='w-full flex justify-between items-center'>
									<MobileStepper
										variant='text'
										steps={10}
										position='static'
										activeStep={activeStep}
									/>
									<Countdown
										key={countdownKey}
										date={endTime}
										onComplete={activeStep !== 9 ? handleNext : handleQuizEnd}
										renderer={({ seconds }) => (
											<div
												className={`text-3xl font-extrabold ${
													seconds < 10 ? 'text-red-500' : 'text-black'
												}`}>
												{seconds}
											</div>
										)}
									/>
								</div>
								<div className='font-bold text-lg text-left p-3'>
									{questions[activeStep]?.title}
								</div>
								<div className='p-3 text-justify'>
									{questions[activeStep]?.body}
								</div>
								<div className='w-full justify-evenly items-center '>
									<FormControl
										style={{
											width: '100%',
											display: 'flex',
											flexWrap: 'wrap',
											flexDirection: 'row',
											justifyContent: 'evenly',
											alignItems: 'center',
										}}
										variant='standard'>
										<RadioGroup
											aria-labelledby='demo-error-radios'
											name='quiz'
											value={selectedValue}
											style={{
												width: '100%',
												display: 'flex',
												flexWrap: 'wrap',
												flexDirection: 'row',
												justifyContent: 'center',
												alignItems: 'center',
												gap: '1rem',
											}}
											onChange={handleRadioChange}>
											{questions[activeStep]?.body
												?.split(' ')
												.slice(0, 4)
												.map((item, index) => (
													<FormControlLabel
														style={{
															width: '200px',
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'between',
															paddingX: '1rem',
															paddingY: '1rem',
															borderRadius: '5px',
															border:
																selectedValue === item
																	? '2px solid #000'
																	: '1px solid #e0e0e0',
														}}
														key={index}
														value={item}
														control={<Radio disabled={isOptionsDisabled} />} // Disable radio button
														label={
															<div className='flex justify-between items-center'>
																<div className='pr-1'>
																	{['A', 'B', 'C', 'D'][index]}
																	{')'}
																</div>
																<div> {item}</div>
															</div>
														}
													/>
												))}
										</RadioGroup>
									</FormControl>
								</div>
								<div className='w-full'>
									<MobileStepper
										variant={stepperVariant}
										style={{}}
										steps={10}
										position='static'
										activeStep={activeStep}
										nextButton={
											<Button
												variant='contained'
												onClick={activeStep === 9 ? handleQuizEnd : handleNext}
												color='primary'
												endIcon={
													theme.direction === 'rtl' ? (
														<KeyboardArrowLeft />
													) : (
														<KeyboardArrowRight />
													)
												}
												disabled={isNextDisabled}>
												Next
											</Button>
										}
										backButton={
											<Button
												color='primary'
												variant='outlined'
												onClick={handleBack}
												startIcon={
													theme.direction === 'rtl' ? (
														<KeyboardArrowRight />
													) : (
														<KeyboardArrowLeft />
													)
												}
												disabled={isBackDisabled || activeStep === 0}>
												Back
											</Button>
										}
									/>
								</div>
							</div>
						</div>
						<div>
							<div className=' h-full flex justify-evenly items-end p-2 m-2'>
								<div className='flex justify-center items-center'>
									<div className='flex justify-center items-center'>
										<a href='https://ismetomerkoyuncu.tech' target='_blank'>
											ismetomerkoyuncu
										</a>
									</div>
									<div className='flex justify-center items-center'>
										<IconButton
											href='https://github.com/iomerkoyuncu/quiz-app'
											target='_blank'>
											<GitHub />
										</IconButton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}
