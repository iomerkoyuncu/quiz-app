import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Modal, Box, Button, IconButton } from '@mui/material'
import { Visibility } from '@mui/icons-material'

function Answers() {
	const [quizArray, setQuizArray] = useState([])
	const [selectedQuiz, setSelectedQuiz] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		const storedQuizArray = localStorage.getItem('quizArray')
		if (storedQuizArray) {
			setQuizArray(JSON.parse(storedQuizArray))
		}
	}, [])

	const columns = [
		{ field: 'id', headerName: 'ID', width: 50 },
		{
			field: 'beginTime',
			headerName: 'Begin Time',
			width: 170,
			renderCell: (params) =>
				new Date(params.row.quiz_begin_time).toLocaleString(),
		},
		{
			field: 'endTime',
			headerName: 'End Time',
			width: 170,

			renderCell: (params) =>
				params.row.quiz_end_time
					? new Date(params.row.quiz_end_time).toLocaleString()
					: 'Not completed',
		},
		{
			field: 'actions',
			headerName: 'Actions',
			width: 70,
			sortable: false,
			align: 'center',
			renderCell: (params) => (
				<IconButton
					onClick={() => {
						handleOpenModal(params.row)
					}}>
					<Visibility />
				</IconButton>
			),
		},
	]

	const handleOpenModal = (quiz) => {
		setModalOpen(true)
		setSelectedQuiz(quiz)
	}

	const handleCloseModal = () => {
		setModalOpen(false)
		setSelectedQuiz(null)
	}

	return (
		<div className='w-full'>
			<DataGrid
				rows={quizArray.map((quiz, index) => ({ id: index + 1, ...quiz }))}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5, 10, 20]}
				checkboxSelection={false}
				disableSelectionOnClick
			/>
			<Modal open={modalOpen} onClose={handleCloseModal}>
				<Box
					style={{
						outline: 'none',
						position: 'absolute',
						top: '50%',
						left: '50%',
						borderRadius: 30,
						transform: 'translate(-50%, -50%)',
						width: 500,
						minHeight: 300,
						backgroundColor: 'white',
						boxShadow: 24,
						padding: 30,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}>
					<h2 className='text-lg text-center font-bold'>Quiz Details</h2>
					<div className='flex justify-evenly items-center p-2 m-2'>
						<p className='text-center'>
							Begin Time: <br />
							{new Date(selectedQuiz?.quiz_begin_time).toLocaleString()}
						</p>
						<p className='text-center'>
							End Time: <br />
							{new Date(selectedQuiz?.quiz_end_time).toLocaleString()}
						</p>
					</div>
					<table>
						<thead>
							<tr>
								<th>Answers</th>
							</tr>
						</thead>
						<tbody>
							{selectedQuiz?.answers.map((answer, index) => (
								<tr key={index}>
									<td>
										<span className='pr-1 font-bold'> {index + 1}</span>:{' '}
										<span
											className={`${
												answer === '' ? 'text-red-500' : 'text-black'
											}`}>
											{answer === '' ? 'Not answered' : answer}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<Button onClick={handleCloseModal}>Close</Button>
				</Box>
			</Modal>
		</div>
	)
}

export default Answers
