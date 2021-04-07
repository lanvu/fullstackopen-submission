interface HeaderProps {
  name: string;
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartDescriptionBase extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartDescriptionBase {
  type: 'normal';
}
interface CourseProjectPart extends CoursePartBase {
  type: 'groupProject';
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartDescriptionBase {
  type: 'submission';
  exerciseSubmissionLink: string;
}

interface CourseSpecialPart extends CoursePartDescriptionBase {
  type: 'special';
  requirements: string[];
}

type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseSpecialPart;

interface PartProps {
  part: CoursePart;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  courseParts: CoursePart[];
}

const Header = ({ name }: HeaderProps) => {
  return <h1>{name}</h1>;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
  const attributes = [];

  switch (part.type) {
    case 'normal':
      attributes.push(
        <div>
          <i>{part.description}</i>
        </div>
      );
      break;
    case 'groupProject':
      attributes.push(<div>project exercises {part.groupProjectCount}</div>);
      break;
    case 'submission':
      attributes.push(
        <div>
          <i>{part.description}</i>
        </div>
      );
      attributes.push(<div>submit to {part.exerciseSubmissionLink}</div>);
      break;
    case 'special':
      attributes.push(
        <div>
          <i>{part.description}</i>
        </div>
      );
      attributes.push(
        <div>required skills: {part.requirements.join(', ')}</div>
      );
      break;
    default:
      return assertNever(part);
  }
  return (
    <p>
      <div>
        <b>
          {part.name} {part.exerciseCount}
        </b>
      </div>
      {attributes.map((a) => a)}
    </p>
  );
};

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <Part key={index} part={part}></Part>
      ))}
    </div>
  );
};

const Total = ({ courseParts }: TotalProps) => {
  return (
    <p>
      Number of exercises{' '}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

const App = () => {
  const courseName = 'Half Stack application development';
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is the leisured course part',
      type: 'normal',
    },
    {
      name: 'Advanced',
      exerciseCount: 7,
      description: 'This is the harded course part',
      type: 'normal',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      type: 'groupProject',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      exerciseSubmissionLink: 'https://fake-exercise-submit.made-up-url.dev',
      type: 'submission',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      type: 'special',
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
