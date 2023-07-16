import { Api } from '../api'
import BigActionCard from '../components/BigActionCard'
import Loading from '../components/Loading'
import { useData } from '../hooks/useData'

const HomePage = () => {
  const [types] = useData(() => Api.getAllTypes())
  return (
    <>
      <Loading {...types}>
        {(data) => (
          <>
            {data.map((x) => (
              <BigActionCard
                key={x.id}
                taskType={x}
              />
            ))}
          </>
        )}
      </Loading>
    </>
  )
}

export default HomePage
