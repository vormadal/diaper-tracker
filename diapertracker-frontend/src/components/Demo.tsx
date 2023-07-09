import { Api } from '../api'
import { useData } from '../hooks/useData'
import BigActionCard from './BigActionCard'
import Loading from './Loading'

type Props = {}

const Demo = ({}: Props) => {
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

export default Demo
