import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });



type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
  activePage: number
  count: number
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    let urlServer = "http://localhost:3000/users/page/0"

    if (ctx.query.page) {
      urlServer = `http://localhost:3000/users/page/${+ctx.query.page - 1}`
    }
    // ctx.query.page
    const res = await fetch(urlServer, { method: 'GET' })
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], activePage: 0, count: 0 } }
    }
    const { users, count } = await res.json()
    return {
      props: { statusCode: 200, users: users, activePage: Number(ctx.query.page || 1), count: count }
    }
  } catch (e) {
    return { props: { statusCode: 500, users: [], activePage: 0, count: 0 } }
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({ statusCode, users, activePage, count }: TGetServerSideProps) {
  const rangePages = Math.ceil(activePage / 10)
  const lastRangePages = Math.ceil(count / (10 * 20));
  
  const defaultPages = Array(10).fill((rangePages - 1) * 10).map((pageNumber, index) => ({
    pageNumber: index + 1 + pageNumber,
    active: false
  }))
  const [pages, setPegas] = useState(defaultPages.map((page) => ({...page, active: page.pageNumber === activePage})));
  if (statusCode !== 200 ) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  if (rangePages > lastRangePages) {
    return <Alert variant={'danger'}>нету данных для загрузки</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.updatedAt}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First onClick={() => {
              const firstPages = Array(10).fill(0).map((pageNumber, index) => ({
                pageNumber: index + 1 + pageNumber,
                active: activePage === index + 1 + pageNumber
              }))
              setPegas(firstPages);
            }}/>
            <Pagination.Prev onClick={() => {
              const firstRangePages = 1;
              const mabyPrevRangePages = Math.ceil(pages[0].pageNumber / 10) - 1;
              const nextRangePages = firstRangePages < mabyPrevRangePages ? mabyPrevRangePages : firstRangePages
              const lastPages = Array(10).fill((nextRangePages - 1) * 10).map((pageNumber, index) => ({
                pageNumber: index + 1 + pageNumber,
                active: activePage === index + 1 + pageNumber
              }))
              setPegas(lastPages);
            }}/>
            {pages.map(({ pageNumber: number, active }) =>
              <Pagination.Item href={`/?page=${number}`} active={active} key={number}>{number}</Pagination.Item>
            )}
            <Pagination.Next onClick={() => {
              
              const mabyNextRangePages = Math.ceil(pages[0].pageNumber / 10) + 1;
              const nextRangePages = lastRangePages > mabyNextRangePages ? mabyNextRangePages : lastRangePages
              const lastPages = Array(10).fill((nextRangePages - 1) * 10).map((pageNumber, index) => ({
                pageNumber: index + 1 + pageNumber,
                active: activePage === index + 1 + pageNumber
              }))
              setPegas(lastPages);
            }}/>
            <Pagination.Last onClick={() => {
              const lastRangePages = Math.ceil(count / (10 * 20))
              const lastPages = Array(10).fill((lastRangePages - 1) * 10).map((pageNumber, index) => ({
                pageNumber: index + 1 + pageNumber,
                active: activePage === index + 1 + pageNumber
              }))
              setPegas(lastPages);
            }}/>
          </Pagination>

        </Container>
      </main>
    </>
  );
}
