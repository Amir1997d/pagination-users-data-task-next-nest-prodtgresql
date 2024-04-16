import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useState } from 'react';
import { Container, Alert, Pagination } from 'react-bootstrap';
import Head from 'next/head';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  totalCount: number;
};

export const getServerSideProps: GetServerSideProps<TGetServerSideProps> = async (ctx: GetServerSidePropsContext) => {
  const page = Number(ctx.query.page) || 1;
  const pageSize = 20;

  try {
    const res = await fetch(`http://localhost:3000/users?page=${page}&pageSize=${pageSize}`);
    
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], totalCount: 0 } };
    }

    const { users, totalCount } = await res.json();
    console.log(users)
    return { props: { statusCode: 200, users, totalCount } };
  } catch (e) {
    return { props: { statusCode: 500, users: [], totalCount: 0 } };
  }
};

const Home = ({ statusCode, users }: TGetServerSideProps) => {
 
  const totalPages = 10
  const visibleUsers = users;
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  if (statusCode !== 200) {
    return <Alert variant="danger">Ошибка {statusCode} при загрузке данных</Alert>;
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push({
      pathname: '/',
      query: { page: page.toString() },
    });
  };

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
          <h1 className="mb-5">Пользователи</h1>

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
              {visibleUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={isFirstPage} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={isFirstPage} />

            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={isLastPage} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={isLastPage} />
          </Pagination>

        </Container>
      </main>
    </>
  );
};

export default Home;
