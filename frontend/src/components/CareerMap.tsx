import type { Subject } from '../models/types';
import './CareerMap.css';

interface CareerMapProps {
  subjects: Subject[];
}

type RoadmapState = 'approved' | 'eligible' | 'blocked';

interface SemesterGroup {
  semester: number;
  subjects: Subject[];
}

function getSubjectState(subject: Subject): RoadmapState {
  if (subject.status === 'Approved' || subject.status === 'PartiallyApproved') {
    return 'approved';
  }

  if (subject.isEligible) {
    return 'eligible';
  }

  return 'blocked';
}

function getStateLabel(subject: Subject): string {
  if (subject.status === 'Approved') {
    return 'Aprobada';
  }

  if (subject.status === 'PartiallyApproved') {
    return 'Cursada';
  }

  if (subject.isEligible) {
    return 'Habilitada';
  }

  return 'Bloqueada';
}

function groupBySemester(subjects: Subject[]): SemesterGroup[] {
  const groups = subjects.reduce((acc, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }

    acc[subject.semester].push(subject);
    return acc;
  }, {} as Record<number, Subject[]>);

  return Object.keys(groups)
    .map(Number)
    .sort((left, right) => left - right)
    .map(semester => ({
      semester,
      subjects: groups[semester].slice().sort((left, right) => left.name.localeCompare(right.name))
    }));
}

export default function CareerMap({ subjects }: CareerMapProps) {
  const semesterGroups = groupBySemester(subjects);

  return (
    <div className="career-map">
      <div className="career-map-header">
        <div>
          <h2>Vista general</h2>
          <p>Mapa compacto de toda la carrera, ordenado por semestre y con estado de cursada.</p>
        </div>

        <div className="career-map-legend" aria-label="Leyenda de estados">
          <span className="legend-item legend-item-approved">Aprobada</span>
          <span className="legend-item legend-item-eligible">Habilitada</span>
          <span className="legend-item legend-item-blocked">Bloqueada</span>
        </div>
      </div>

      <div className="career-map-grid">
        {semesterGroups.map(group => (
          <section
            key={group.semester}
            className={`semester-card ${group.subjects.length === 1 ? 'semester-card-single' : ''}`}
          >
            <div className="semester-card-header">
              <span className="semester-card-title">Semestre {group.semester}</span>
              <span className="semester-card-count">{group.subjects.length}</span>
            </div>

            <div className="semester-card-body">
              {group.subjects.map(subject => {
                const state = getSubjectState(subject);

                return (
                  <article key={subject.id} className={`roadmap-subject ${state}`}>
                    <div className="roadmap-subject-indicator" aria-hidden="true" />
                    <div className="roadmap-subject-content">
                      <span className="roadmap-subject-name">{subject.name}</span>
                      <span className="roadmap-subject-state">{getStateLabel(subject)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}