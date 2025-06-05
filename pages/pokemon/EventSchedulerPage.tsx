
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Textarea from '../../ui/Textarea';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { MOCK_CHANNELS, MOCK_POKEMON_NAMES, POKEMON_TYPES, EVENT_TYPES_OPTIONS, EVENT_RECURRENCE_OPTIONS } from '../../constants';
import { ScheduledEvent, EventType, EventRecurrence, Channel } from '../../types';
import { PlusCircle, Edit3, Trash2, CalendarClock, Sparkles, ArrowUpCircle, Droplets, Zap, Settings2, AlertCircle, CheckCircle } from 'lucide-react';

const initialEventState: Omit<ScheduledEvent, 'id'> = {
  name: '',
  description: '',
  eventType: EventType.CUSTOM,
  startDate: '',
  endDate: '',
  targetChannelIds: [],
  recurrence: EventRecurrence.NONE,
  isEnabled: true,
  boostPercentage: undefined,
  targetPokemonName: undefined,
  targetPokemonType: undefined,
  customDetails: undefined,
};

// Helper to get current datetime-local string
const getCurrentDateTimeLocal = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
    return now.toISOString().slice(0, 16);
};


const EventSchedulerPage: React.FC = () => {
  const [events, setEvents] = useState<ScheduledEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<ScheduledEvent | Omit<ScheduledEvent, 'id'>>(initialEventState);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
   const [globalStatus, setGlobalStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);


  // Mock loading initial events
  useEffect(() => {
    const mockEvents: ScheduledEvent[] = [
      {
        id: 'evt1', name: 'Weekend Shiny Hunt!', description: 'Increased shiny rates for all Pokémon.',
        eventType: EventType.SHINY_BOOST, boostPercentage: 50,
        startDate: '2024-08-10T10:00', endDate: '2024-08-12T22:00',
        targetChannelIds: [MOCK_CHANNELS[1].id], recurrence: EventRecurrence.NONE, isEnabled: true,
      },
      {
        id: 'evt2', name: 'Pikachu Outbreak', description: 'Pikachu will spawn more frequently.',
        eventType: EventType.SPAWN_BOOST_POKEMON, targetPokemonName: 'Pikachu',
        startDate: '2024-07-20T00:00', endDate: '2024-07-21T23:59',
        targetChannelIds: [MOCK_CHANNELS[1].id, MOCK_CHANNELS[2].id], recurrence: EventRecurrence.NONE, isEnabled: false,
      },
    ];
    setEvents(mockEvents);
    initialEventState.startDate = getCurrentDateTimeLocal();
    initialEventState.endDate = getCurrentDateTimeLocal();

  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!currentEvent.name.trim()) errors.name = 'Event name is required.';
    if (!currentEvent.startDate) errors.startDate = 'Start date is required.';
    if (!currentEvent.endDate) errors.endDate = 'End date is required.';
    if (currentEvent.startDate && currentEvent.endDate && new Date(currentEvent.startDate) >= new Date(currentEvent.endDate)) {
      errors.endDate = 'End date must be after start date.';
    }
    if (currentEvent.eventType === EventType.SPAWN_BOOST_POKEMON && !currentEvent.targetPokemonName?.trim()) {
      errors.targetPokemonName = 'Pokémon name is required for this event type.';
    }
    if (currentEvent.eventType === EventType.SPAWN_BOOST_TYPE && !currentEvent.targetPokemonType) {
      errors.targetPokemonType = 'Pokémon type is required for this event type.';
    }
    if ((currentEvent.eventType === EventType.SHINY_BOOST || currentEvent.eventType === EventType.XP_BOOST || currentEvent.eventType === EventType.ITEM_DROP_BOOST) && (!currentEvent.boostPercentage || currentEvent.boostPercentage <= 0)) {
      errors.boostPercentage = 'Boost percentage must be a positive number.';
    }
    if (currentEvent.targetChannelIds.length === 0) errors.targetChannelIds = 'Select at least one target channel.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setCurrentEvent(prev => {
        let finalValue: string | number | boolean | undefined = value;
        if (type === 'number') finalValue = parseFloat(value) || undefined;
        if (name === 'boostPercentage' && value === '') finalValue = undefined; // Allow clearing boost percentage

        const updatedEvent = {...prev, [name]: finalValue };
        
        // Reset conditional fields if eventType changes
        if (name === 'eventType') {
            updatedEvent.boostPercentage = undefined;
            updatedEvent.targetPokemonName = undefined;
            updatedEvent.targetPokemonType = undefined;
            updatedEvent.customDetails = undefined;
        }
        return updatedEvent;
    });
  };
  
  const handleChannelSelection = (channelId: string) => {
    setCurrentEvent(prev => ({
      ...prev,
      targetChannelIds: prev.targetChannelIds.includes(channelId)
        ? prev.targetChannelIds.filter(id => id !== channelId)
        : [...prev.targetChannelIds, channelId]
    }));
  };

  const openModalForCreate = () => {
    setCurrentEvent({...initialEventState, startDate: getCurrentDateTimeLocal(), endDate: getCurrentDateTimeLocal()});
    setIsEditing(false);
    setFormErrors({});
    setGlobalStatus(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (event: ScheduledEvent) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setFormErrors({});
    setGlobalStatus(null);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!validateForm()) return;
    setGlobalStatus(null);

    if (isEditing && 'id' in currentEvent) {
      setEvents(prev => prev.map(ev => ev.id === (currentEvent as ScheduledEvent).id ? (currentEvent as ScheduledEvent) : ev));
       setGlobalStatus({type: 'success', message: `Event "${currentEvent.name}" updated (mock).`});
    } else {
      const newEventWithId: ScheduledEvent = { ...currentEvent, id: `evt-${Date.now()}` } as ScheduledEvent;
      setEvents(prev => [...prev, newEventWithId]);
      setGlobalStatus({type: 'success', message: `Event "${newEventWithId.name}" created (mock).`});
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event (mock operation)?")) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setGlobalStatus({type: 'success', message: `Event deleted (mock).`});
    }
  };

  const getEventStatus = (event: ScheduledEvent): { text: string; color: string } => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (!event.isEnabled) return { text: 'Disabled', color: 'bg-neutral-400 dark:bg-neutral-600' };
    if (now < start) return { text: 'Scheduled', color: 'bg-sky-500' };
    if (now >= start && now <= end) return { text: 'Active', color: 'bg-green-500' };
    return { text: 'Past', color: 'bg-red-500' };
  };

  const getEventTypeIcon = (type: EventType) => {
    switch(type) {
        case EventType.SHINY_BOOST: return <Sparkles className="text-yellow-400" size={18}/>;
        case EventType.SPAWN_BOOST_POKEMON: return <Zap className="text-orange-400" size={18}/>;
        case EventType.SPAWN_BOOST_TYPE: return <Zap className="text-blue-400" size={18}/>;
        case EventType.XP_BOOST: return <ArrowUpCircle className="text-green-400" size={18}/>;
        case EventType.ITEM_DROP_BOOST: return <Droplets className="text-teal-400" size={18}/>;
        default: return <Settings2 className="text-neutral-400" size={18}/>;
    }
  };

  const { activeUpcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const activeUpcoming: ScheduledEvent[] = [];
    const past: ScheduledEvent[] = [];
    events.forEach(event => {
      if (!event.isEnabled || new Date(event.endDate) < now) {
        past.push(event);
      } else {
        activeUpcoming.push(event);
      }
    });
    activeUpcoming.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    past.sort((a,b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    return { activeUpcomingEvents: activeUpcoming, pastEvents: past };
  }, [events]);


  return (
    <div className="space-y-6">
      <Card title="Event Scheduler" icon={<CalendarClock className="text-primary-500" size={24}/>}>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Create and manage automated events for your Discord bot. All operations are mocked for this demo.
        </p>
        <Button onClick={openModalForCreate} leftIcon={<PlusCircle size={16}/>}>
          Create New Event
        </Button>
         {globalStatus && (
            <div className={`my-4 p-3 rounded-md text-sm flex items-center ${globalStatus.type === 'success' ? 'bg-green-100 dark:bg-green-700/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700/30 text-red-700 dark:text-red-200'}`}>
            {globalStatus.type === 'success' ? <CheckCircle size={18} className="mr-2"/> : <AlertCircle size={18} className="mr-2"/>}
            {globalStatus.message}
            </div>
        )}
      </Card>

      {['Active & Upcoming Events', 'Past & Disabled Events'].map(sectionTitle => {
        const displayEvents = sectionTitle === 'Active & Upcoming Events' ? activeUpcomingEvents : pastEvents;
        if (displayEvents.length === 0 && sectionTitle === 'Active & Upcoming Events' && events.length > 0) return null; // Don't show empty upcoming if there are past events

        return (
            <section key={sectionTitle}>
                <h2 className="text-xl font-semibold mb-3 text-neutral-700 dark:text-neutral-200">{sectionTitle}</h2>
                {displayEvents.length === 0 ? (
                <Card className="text-center">
                    <p className="py-8 text-neutral-500 dark:text-neutral-400">No events in this category.</p>
                </Card>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayEvents.map(event => {
                    const status = getEventStatus(event);
                    return (
                        <Card key={event.id} title={
                            <div className="flex items-center gap-2">
                                {getEventTypeIcon(event.eventType)} 
                                <span className="truncate">{event.name}</span>
                            </div>
                        } className="flex flex-col justify-between">
                        <div>
                            <p className="text-xs mb-1"><span className={`px-2 py-0.5 text-white text-xs rounded-full ${status.color}`}>{status.text}</span></p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">{event.description}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                Starts: {new Date(event.startDate).toLocaleString()} <br/>
                                Ends: {new Date(event.endDate).toLocaleString()}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Recurrence: {event.recurrence}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Type: {event.eventType}</p>
                            {event.boostPercentage && <p className="text-xs text-neutral-500 dark:text-neutral-500">Boost: {event.boostPercentage}%</p>}
                            {event.targetPokemonName && <p className="text-xs text-neutral-500 dark:text-neutral-500">Pokémon: {event.targetPokemonName}</p>}
                            {event.targetPokemonType && <p className="text-xs text-neutral-500 dark:text-neutral-500">Type: {event.targetPokemonType}</p>}
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-600 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openModalForEdit(event)} leftIcon={<Edit3 size={14}/>}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event.id)} leftIcon={<Trash2 size={14}/>}>Delete</Button>
                        </div>
                        </Card>
                    );
                    })}
                </div>
                )}
            </section>
        );
        })}


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <Card title={isEditing ? "Edit Event" : "Create New Event"} className="w-full max-w-2xl bg-white dark:bg-neutral-800 max-h-[90vh] flex flex-col">
            <form onSubmit={(e) => e.preventDefault()} className="overflow-y-auto p-1 space-y-4">
              <Input label="Event Name" name="name" value={currentEvent.name} onChange={handleInputChange} error={formErrors.name} />
              <Textarea label="Description" name="description" value={currentEvent.description} onChange={handleInputChange} rows={3} />
              <Select label="Event Type" name="eventType" options={EVENT_TYPES_OPTIONS} value={currentEvent.eventType} onChange={handleInputChange} />

              {currentEvent.eventType === EventType.SPAWN_BOOST_POKEMON && (
                <Select label="Target Pokémon" name="targetPokemonName" options={MOCK_POKEMON_NAMES.map(p => ({label: p, value: p}))} value={currentEvent.targetPokemonName || ''} onChange={handleInputChange} placeholder="Select Pokémon..." error={formErrors.targetPokemonName} />
              )}
              {currentEvent.eventType === EventType.SPAWN_BOOST_TYPE && (
                <Select label="Target Pokémon Type" name="targetPokemonType" options={POKEMON_TYPES.map(t => ({label: t, value: t}))} value={currentEvent.targetPokemonType || ''} onChange={handleInputChange} placeholder="Select Type..." error={formErrors.targetPokemonType}/>
              )}
              {(currentEvent.eventType === EventType.SHINY_BOOST || currentEvent.eventType === EventType.XP_BOOST || currentEvent.eventType === EventType.ITEM_DROP_BOOST) && (
                <Input label="Boost Percentage (%)" name="boostPercentage" type="number" value={currentEvent.boostPercentage || ''} onChange={handleInputChange} min="1" max="1000" error={formErrors.boostPercentage}/>
              )}
              {currentEvent.eventType === EventType.CUSTOM && (
                 <Textarea label="Custom Event Details" name="customDetails" value={currentEvent.customDetails || ''} onChange={handleInputChange} rows={2} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Start Date & Time" name="startDate" type="datetime-local" value={currentEvent.startDate} onChange={handleInputChange} error={formErrors.startDate}/>
                <Input label="End Date & Time" name="endDate" type="datetime-local" value={currentEvent.endDate} onChange={handleInputChange} error={formErrors.endDate}/>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Target Channels</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border rounded-md dark:border-neutral-700">
                    {MOCK_CHANNELS.map(channel => (
                    <label key={channel.id} className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600 rounded" checked={currentEvent.targetChannelIds.includes(channel.id)} onChange={() => handleChannelSelection(channel.id)} />
                        <span>{channel.name}</span>
                    </label>
                    ))}
                </div>
                {formErrors.targetChannelIds && <p className="text-red-500 text-sm mt-1">{formErrors.targetChannelIds}</p>}
              </div>
              
              <Select label="Recurrence" name="recurrence" options={EVENT_RECURRENCE_OPTIONS} value={currentEvent.recurrence} onChange={handleInputChange} />
              <ToggleSwitch id="eventEnabled" label="Enable Event" checked={currentEvent.isEnabled} onChange={(checked) => setCurrentEvent(prev => ({...prev, isEnabled: checked}))} />
            </form>
            <div className="mt-auto pt-4 flex justify-end space-x-2 sticky bottom-0 bg-white dark:bg-neutral-800 pb-4 px-4 border-t dark:border-neutral-700">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEvent}>{isEditing ? "Save Changes" : "Create Event"}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventSchedulerPage;
