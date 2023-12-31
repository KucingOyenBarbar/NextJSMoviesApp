/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import Head from 'next/head'
import { useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import fetchPopularMovie from '@/lib/movie/fetchPopularMovie'
import MovieButtonBack from '@/pages/movie/components/MovieButtonBack'
import MovieHeadingTitle from '@/pages/movie/components/MovieHeadingTitle'
import MovieItemsListInfiniteScroll from '../movie/components/MovieItemsListInfiniteScroll'

type Props = { movies: Promise<Movies[]> }

export default function Popular({
    movies: initialMovies,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    const [movies, setMovies] = useState(initialMovies)
    const [page, setPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function fetchMoreData() {
        const api: string = 'http://localhost:5000'
        const endpoint: string = 'movies'
        const response: Response = await fetch(
            `${api}/${endpoint}?page=${page}`
        )

        const newMovies: Movies[] = await response.json()

        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setMovies([...movies, ...newMovies])
            setPage(page + 1)
        }, 300)
    }

    return (
        <>
            <Head>
                <title>Film Popular Terbaru dan Terlengkap Untuk Anda</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container className="position-relative py-5 pt-5 mt-5">
                <Row className="justify-content-start g-2 py-3">
                    <Col>
                        <Card
                            bg="white"
                            color="text-dark"
                            style={{ borderRadius: '12px' }}
                        >
                            <Card.Body>
                                <MovieButtonBack />
                                <MovieHeadingTitle title="Film Popular Terbaru dan Terlengkap Untuk Anda" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="justify-content-start g-2 py-3">
                    <Col>
                        <MovieItemsListInfiniteScroll
                            items={movies}
                            fetchMoreData={fetchMoreData}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const movies: Promise<Movies[]> = await fetchPopularMovie()

    return { props: { movies }, revalidate: 60 }
}
