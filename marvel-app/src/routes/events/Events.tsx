import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EventsElements from '../../components/commons/EventsElements';
import { BASE_URL, KEY_STRING } from '../../key';
import {
	Blank,
	Dot,
	EventSliderTextBox,
	EventTitle,
	FullPageSliderPic,
	Loading,
} from '../../styled';
import { IEvents, IEventsResult } from '../../types_store/EventsType';

const HorizonBar = styled.div`
	background-color: #f0131e;
	width: 100vw;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Window = styled.div<{ height: number }>`
	width: 100vw;
	height: ${props => props.height}px;
`;

const SeeMoreBtn = styled.button`
	background-color: #f0131e;
	border: none;
	border-radius: 8px;
	color: white;
	padding: 10px;
	cursor: pointer;
	&:hover {
		background-color: transparent;
	}
`;

const SmallTitle = styled.h5`
	color: white;
	display: inline-block;
	cursor: pointer;
	&:hover {
		color: #f0131e;
	}
`;

const TOTAL = 74;

const SLICED_FULL_PAGE_INDEX = 7;

function Events() {
	const windowWidth = window.outerWidth;

	const [windowHeight, setWindowHeight] = useState(window.outerHeight);

	useEffect(() => {
		window.addEventListener('resize', resizeWindowHeight);
		return function () {
			window.removeEventListener('resize', resizeWindowHeight);
		};
	}, []);

	const resizeWindowHeight = () => {
		setWindowHeight(window.outerHeight);
	};

	const slidePicVarinat = {
		initial: {
			x: windowWidth,
		},
		animate: {
			x: 0,
			transition: {
				duration: 1,
			},
		},
		exit: {
			x: -windowWidth,
			transition: {
				duration: 1,
			},
		},
	};

	const fetchEvents = async () => {
		const res = await fetch(
			`${BASE_URL}events?${KEY_STRING}&offset=0&limit=${TOTAL}`,
		);
		return await res.json();
	};

	const { data: events, isLoading } = useQuery<IEvents>(
		['events'],
		fetchEvents,
	);

	const [eventsArr, setEventsArr] = useState<IEventsResult[]>();

	const [visible, setVisible] = useState(0);

	const [isSliderComplete, setIsSliderComplete] = useState(true);

	const increaseVisiblePicIndex = () => {
		if (isSliderComplete) {
			setIsSliderComplete(false);
			setVisible(index =>
				index + 1 === SLICED_FULL_PAGE_INDEX ? 0 : (index += 1),
			);
		}
	};

	const setSlidingCompleteDone = () => {
		setIsSliderComplete(true);
	};

	useEffect(() => {
		const timer = setInterval(increaseVisiblePicIndex, 9000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	useEffect(() => {
		const tmpEventsArr: IEventsResult[] = [];
		getRandomSevenNumArr().forEach(number => {
			if (events?.data.results[number]) {
				tmpEventsArr.push(events?.data.results[number]);
			}
		});
		setEventsArr(tmpEventsArr);
	}, [events]);

	const getRandomSevenNumArr = (): number[] => {
		const set: Set<number> = new Set();
		for (let i = 0; set.size !== SLICED_FULL_PAGE_INDEX + 1; i++) {
			set.add(Math.floor(Math.random() * TOTAL + 1));
		}
		return Array.from(set);
	};

	const showDataofThisTitle = async (
		e: React.MouseEvent<HTMLHeadingElement>,
	) => {
		e.stopPropagation();
		const targetName = e.currentTarget.textContent?.split(': ')[1];
		const res = await fetch(
			`${BASE_URL}events?${KEY_STRING}&name=${targetName}`,
		);
		const data: IEvents = await res.json();
		if (data) nav('/events/detail/' + data.data.results[0].id);
	};

	const nav = useNavigate();

	return (
		<>
			<Helmet>
				<title>Events</title>
			</Helmet>
			{isLoading ? (
				<Loading src={process.env.PUBLIC_URL + '/images/giphy.gif'} />
			) : null}
			<Window height={windowHeight - 220}>
				<AnimatePresence
					onExitComplete={setSlidingCompleteDone}
					initial={false}
				>
					<motion.span key={visible}>
						{eventsArr ? (
							<>
								{eventsArr.map((event, i) => {
									return (
										<span key={event.id}>
											{visible === i ? (
												<FullPageSliderPic
													variants={slidePicVarinat}
													onClick={
														increaseVisiblePicIndex
													}
													initial="initial"
													animate="animate"
													exit="exit"
													height={windowHeight - 220}
													path={
														event.thumbnail.path +
														'/landscape_incredible.jpg'
													}
												>
													<EventSliderTextBox>
														<EventTitle>
															{event.title}
														</EventTitle>
														<h5>
															{event.description}
														</h5>
														{event.start ? (
															<h5>
																{event.start.split(
																	' ',
																)[0] +
																	' - ' +
																	event.end.split(
																		' ',
																	)[0]}
															</h5>
														) : null}
														{event.previous &&
														event.next ? (
															<div>
																<SmallTitle
																	onClick={
																		showDataofThisTitle
																	}
																>
																	{'previous: ' +
																		event.previous.name.toUpperCase()}
																</SmallTitle>
																&emsp;
																<SmallTitle
																	onClick={
																		showDataofThisTitle
																	}
																>
																	{'next: ' +
																		event.next.name.toUpperCase()}
																</SmallTitle>
															</div>
														) : null}
														<SeeMoreBtn
															onClick={() =>
																nav(
																	'/events/detail/' +
																		event.id,
																)
															}
														>
															see more
														</SeeMoreBtn>
													</EventSliderTextBox>
												</FullPageSliderPic>
											) : null}
										</span>
									);
								})}
							</>
						) : null}
					</motion.span>
				</AnimatePresence>
			</Window>
			<HorizonBar>
				{[0, 1, 2, 3, 4, 5, 6].map(index => {
					return (
						<Dot
							key={index}
							clicked={visible === index}
							onClick={() => setVisible(index)}
						></Dot>
					);
				})}
			</HorizonBar>
			<br></br>
			<br></br>
			<EventsElements events={events?.data.results} />
			<Blank />
		</>
	);
}

export default Events;
