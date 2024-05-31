import { Link } from 'react-router-dom'
import Answers from './Answers'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { GitHub } from '@mui/icons-material'

export default function Welcome() {
	return (
		<div className='flex flex-col w-full h-screen justify-center items-center'>
			<div className=' p-12 m-4 flex flex-col justify-center items-center gap-6 shadow-lg rounded-xl '>
				<h1 className='text-4xl font-bold text-center'>
					Welcome to the Quiz App
				</h1>
				<p className='text-lg text-left w-full'>Instructions:</p>
				<ul className='text-left w-full'>
					<li>Click the button below to start the quiz.</li>
					<li>Answer all questions before the timer runs out.</li>
					<li>You cannot go back to previous questions.</li>
					<li>Good Luck!🍀</li>
				</ul>
				<div className='w-full flex flex-row justify-between items-center'>
					<p>10 Questions / 5 Minutes</p>
					<div className='shadow-lg rounded-lg bg-black text-white'>
						<Button
							component={Link}
							to='/quiz'
							variant='contained'
							color='primary'
							size='small'>
							START QUIZ
						</Button>
					</div>
				</div>

				<Answers />
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
	)
}
