const TRUTHY_VALUES = ['true', 'yes', '1'];

const NORMALIZED_LEVEL = {
  ERROR: 'error',
  ERR: 'error',
  DANGER: 'error',
  FAIL: 'error',
  FAILED: 'error',
  WARNING: 'warning',
  WARN: 'warning',
  CAUTION: 'warning',
  INFO: 'info',
  INFORMATION: 'info',
  SUCCESS: 'success',
};

function toNumber(value) {
  if (value === null || value === undefined) return null;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? null : numeric;
}

function pickFirst(...candidates) {
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue;
    if (typeof candidate === 'string' && candidate.trim() === '') continue;
    return candidate;
  }
  return undefined;
}

function cloneSocketEvent(event) {
  if (!event || typeof event !== 'object') {
    return event;
  }
  const cloned = Array.isArray(event) ? [...event] : { ...event };
  if (event._meta) {
    Object.defineProperty(cloned, '_meta', {
      value: event._meta,
      enumerable: false,
      configurable: true,
      writable: false,
    });
  }
  return cloned;
}

export function enrichSocketEvent(event, context = {}) {
  const cloned = cloneSocketEvent(event) || {};
  const meta = cloned._meta || {};

  if (context.projectId !== undefined && context.projectId !== null && cloned.projectId == null) {
    cloned.projectId = context.projectId;
  }

  if (context.scope && !cloned.scope) {
    cloned.scope = context.scope;
  }

  if (context.destination && !cloned.destination) {
    cloned.destination = context.destination;
  }

  if (!cloned.timestamp) {
    cloned.timestamp = Date.now();
  }

  if (!cloned.domain && cloned.eventdomain) {
    cloned.domain = cloned.eventdomain;
  }

  if (!cloned.domain && meta.headers && meta.headers['event-domain']) {
    cloned.domain = meta.headers['event-domain'];
  }

  if (!cloned.domain && meta.headers && meta.headers['thg-event-domain']) {
    cloned.domain = meta.headers['thg-event-domain'];
  }

  return cloned;
}

export function extractEventdomain(event) {
  const meta = event?._meta?.headers || {};
  const domain = pickFirst(
    event?.domain,
    event?.eventdomain,
    event?.action,
    event?.event,
    meta['event-domain'],
    meta['thg-event-domain'],
    meta['thgEventdomain'],
  );
  return domain ? String(domain).toUpperCase() : '';
}

export function extractProjectId(event) {
  const meta = event?._meta?.headers || {};
  const value = pickFirst(
      event?.projectId,
      event?.projectID,
      event?.project?.id,
      meta['project-id'],
      meta['thg-project-id'],
      meta['thgProjectId'],
  );
  return toNumber(value ?? null);
}

export function eventMatchesProject(event, projectId) {
  if (!projectId) return true;
  const eventProjectId = extractProjectId(event);
  if (eventProjectId == null) return event?.scope ? event.scope.includes(String(projectId)) : true;
  return Number(eventProjectId) === Number(projectId);
}

export function isWorkItemEvent(event) {
  const domain = extractEventdomain(event);
  if (!domain && event?.scope) {
    return ['work', 'work-items', 'work_item', 'task'].some((keyword) =>
        String(event.scope).toLowerCase().includes(keyword)
    );
  }
  return domain.includes('WORK_ITEM') || domain.includes('WORKITEM') || domain.includes('TASK');
}

export function isCommentEvent(event) {
  const domain = extractEventdomain(event);
  if (!domain && event?.scope) {
    return String(event.scope).toLowerCase().includes('comment');
  }
  return domain.includes('COMMENT');
}

export function isMemberEvent(event) {
  const domain = extractEventdomain(event);
  if (!domain && event?.scope) {
    return String(event.scope).toLowerCase().includes('member');
  }
  return domain.includes('MEMBER') || domain.includes('ASSIGNEE') || domain.includes('PARTICIPANT');
}

export function isProjectMetaEvent(event) {
  const domain = extractEventdomain(event);
  if (!domain && event?.scope) {
    return ['project', 'timeline', 'status'].some((keyword) =>
        String(event.scope).toLowerCase().includes(keyword)
    );
  }
  return domain.includes('PROJECT_') || domain.includes('STATUS') || domain.includes('TIMELINE') || domain.includes('AUDIT');
}

export function isTimelineEvent(event) {
  const domain = extractEventdomain(event);
  if (!domain && event?.scope) {
    return ['timeline', 'log'].some((keyword) => String(event.scope).toLowerCase().includes(keyword));
  }
  return domain.includes('TIMELINE') || domain.includes('LOG');
}

export function determineNotificationLevel(event) {
  const meta = event?._meta?.headers || {};
  const candidate = pickFirst(
      event?.level,
      event?.severity,
      event?.priority,
      meta['notification-level'],
      meta['x-level'],
  );

  if (!candidate) return 'info';
  const normalized = String(candidate).toUpperCase();
  return NORMALIZED_LEVEL[normalized] || (TRUTHY_VALUES.includes(normalized.toLowerCase()) ? 'success' : 'info');
}

export function buildNotification(event = {}) {
  const level = determineNotificationLevel(event);
  const title = pickFirst(
      event?.title,
      event?.subject,
      event?.summary,
      event?.messageTitle,
      event?._meta?.headers?.['notification-title']
  );

  const message = pickFirst(
      event?.message,
      event?.description,
      event?.content,
      event?.detail,
      event?.body,
      event?.payload,
      event?._meta?.headers?.['notification-message']
  );

  return {
    level,
    title: title ? String(title) : '',
    message: message ? String(message) : '',
  };
}

export { cloneSocketEvent };

