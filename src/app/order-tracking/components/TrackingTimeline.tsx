'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimelineStage {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

interface TrackingTimelineProps {
  orderId: string;
  stages: TimelineStage[];
}

const TrackingTimeline = ({ orderId, stages }: TrackingTimelineProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [copiedTrackingId, setCopiedTrackingId] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCopyTrackingId = () => {
    if (!isHydrated) return;
    
    navigator.clipboard.writeText(orderId);
    setCopiedTrackingId(true);
    setTimeout(() => setCopiedTrackingId(false), 2000);
  };

  if (!isHydrated) {
    return (
      <div className="rounded-lg bg-card p-6 shadow-elevation-2">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground">
              Order Tracking
            </h2>
            <p className="caption mt-1 text-muted-foreground">
              Tracking ID: {orderId}
            </p>
          </div>
          <button
            className="flex items-center space-x-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-smooth"
            disabled
          >
            <Icon name="ClipboardDocumentIcon" size={18} />
            <span>Copy ID</span>
          </button>
        </div>

        <div className="relative space-y-8">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    stage.isCompleted
                      ? 'bg-success text-success-foreground'
                      : stage.isCurrent
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stage.isCompleted ? (
                    <Icon name="CheckIcon" size={20} />
                  ) : (
                    <span className="data-text text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={`mt-2 h-16 w-0.5 ${
                      stage.isCompleted ? 'bg-success' : 'bg-border'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {stage.status}
                    </h3>
                    <p className="caption mt-1 text-muted-foreground">
                      {stage.description}
                    </p>
                    <p className="caption mt-2 flex items-center space-x-1 text-muted-foreground">
                      <Icon name="MapPinIcon" size={14} />
                      <span>{stage.location}</span>
                    </p>
                  </div>
                  <span className="data-text text-sm text-muted-foreground">
                    {stage.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card p-6 shadow-elevation-2">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Order Tracking
          </h2>
          <p className="caption mt-1 text-muted-foreground">
            Tracking ID: {orderId}
          </p>
        </div>
        <button
          onClick={handleCopyTrackingId}
          className="flex items-center justify-center space-x-2 rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-primary hover:text-primary-foreground"
        >
          <Icon name={copiedTrackingId ? 'CheckIcon' : 'ClipboardDocumentIcon'} size={18} />
          <span>{copiedTrackingId ? 'Copied!' : 'Copy ID'}</span>
        </button>
      </div>

      <div className="relative space-y-8">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-smooth ${
                  stage.isCompleted
                    ? 'bg-success text-success-foreground'
                    : stage.isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {stage.isCompleted ? (
                  <Icon name="CheckIcon" size={20} />
                ) : (
                  <span className="data-text text-sm font-medium">{index + 1}</span>
                )}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`mt-2 h-16 w-0.5 transition-smooth ${
                    stage.isCompleted ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </div>

            <div className="flex-1 pb-8">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {stage.status}
                  </h3>
                  <p className="caption mt-1 text-muted-foreground">
                    {stage.description}
                  </p>
                  <p className="caption mt-2 flex items-center space-x-1 text-muted-foreground">
                    <Icon name="MapPinIcon" size={14} />
                    <span>{stage.location}</span>
                  </p>
                </div>
                <span className="data-text text-sm text-muted-foreground">
                  {stage.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;



