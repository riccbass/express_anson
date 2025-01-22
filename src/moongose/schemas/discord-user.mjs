import moongose, { Schema } from "mongoose";

const DiscordUserSchema = new Schema({
  username: { type: Schema.Types.String, required: true, unique: true },
  discordId: {
    type: moongose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const DiscordUser = moongose.model("DiscordUser", DiscordUserSchema);
