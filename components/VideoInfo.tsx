import { 
  cn, 
  parseTranscript 
} from '@/lib/utils';
import EmptyState from './EmptyState';
import { infos, videoTranscript } from '@/constants';
import { TranscriptEntry, VideoInfoProps } from '..';
import Tabs from './Tabs';
import { TabsType } from '@/app/(root)/profile/[id]/page';

const VideoInfo = ({
  transcript,
  createdAt,
  description,
  videoId,
  videoUrl,
  title
}: VideoInfoProps) => {

  const parsedTranscript = parseTranscript(transcript || "");

  const metaDatas = [
    {
      label: "Video title",
      value: `${title} - ${new Date(createdAt).toLocaleDateString  ("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })}`,
    },
    {
      label: "Video description",
      value: description,
    },
    {
      label: "Video id",
      value: videoId,
    },
    {
      label: "Video url",
      value: videoUrl,
    },
  ];

  const tabs: Array<TabsType> = infos.map((info) => {
    return {
      tab: info,
      render: info == "transcript" ? <Transcript parsedTranscript={parsedTranscript}/> : <Metadata metaDatas={metaDatas}/>
    }
  })

  return (
    <Tabs
      tabs={tabs}
      className={"video-info"}
    />
  )
}

const Transcript = ({parsedTranscript: parsed}: {parsedTranscript: Array<TranscriptEntry>}) => {

  const parsedTranscript = parsed || videoTranscript;
  
  return (
    <ul className='transcript'>
      {parsedTranscript.length > 0 ? (
        parsedTranscript.map((item, index) => (
          <li key={index}>
            <h2>[{item.time}]</h2>
            <p>{item.text}</p>
          </li>
        ))
      ) : (
        <EmptyState 
          icon='/assets/icons/copy.svg'
          title="No transcript available"
          description="This video doesn't include any transcribed content!" 
        />
      )}
    </ul>
  )
}

const Metadata = ({metaDatas}: {metaDatas: Array<{
    label: string; value: string}>}) => (
  <div className="metadata">
    {metaDatas.map(({label, value}, index) => (
      <article key={index}>
        <h2>{label}</h2>
        <p className={cn({'text-pink-100 truncate': label === "Video url"})}>
          {value}
        </p>
      </article>
    ))}
  </div>
);

export default VideoInfo;