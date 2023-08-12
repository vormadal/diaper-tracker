import { Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Api } from '../api'
import Loading from '../components/shared/Loading'
import { useData } from '../hooks/useData'
import { useProject } from '../hooks/useProject'

function selectColor(colorNum: number, colors: number) {
  if (colors < 1) colors = 1 // defaults to one color - avoid divide by zero
  return 'hsl(' + ((colorNum * (360 / colors)) % 360) + ',100%,50%)'
}

function StatisticsPage() {
  const [project] = useProject()
  const [stats] = useData(
    async (projectId) => (projectId ? Api.getTaskStatistics(projectId) : undefined),
    project.project?.id
  )
  return (
    <>
      <Loading {...stats}>
        {(data) => (
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <LineChart
              margin={{ left: 5, right: 20, top: 15, bottom: 45 }}
              data={data.data}
            >
              {data.legend.map((x, i) => (
                <Line
                  key={x}
                  id={x}
                  type="monotone"
                  stroke={selectColor(i + 1, data.legend.length)}
                  dataKey={x}
                />
              ))}
              <Tooltip />
              <XAxis
                dataKey={data.keyLabel}
                angle={-45}
                tickMargin={15}
              >
                <Label
                  value={data.keyLabel}
                  position="insideBottom"
                  offset={-30}
                />
              </XAxis>
              <YAxis
                label={{ value: data.valueLabel, angle: -90, offset: 20, position: 'insideLeft' }}
                allowDecimals={false}
              />
              <Legend verticalAlign="top" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Loading>
    </>
  )
}

export default StatisticsPage
