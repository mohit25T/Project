import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  const { title, description, date, location, region } = req.body;
  const event = new Event({ title, description, date, location, region, creator: req.userId });
  await event.save();
  res.status(201).json(event);
};

export const getEvents = async (req, res) => {
  const { region } = req.query;
  const events = await Event.find({ region });
  res.json(events);
};

export const rsvpEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event.attendees.includes(req.userId)) {
    event.attendees.push(req.userId);
    await event.save();
  }
  res.json(event);
};
